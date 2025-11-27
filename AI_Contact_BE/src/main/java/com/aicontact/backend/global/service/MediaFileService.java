package com.aicontact.backend.global.service;

import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.global.dto.MediaFileDto;
import com.aicontact.backend.global.dto.MediaThumbnailDto;
import com.aicontact.backend.global.dto.response.FavoriteResponse;
import com.aicontact.backend.global.entity.MediaFileEntity;
import com.aicontact.backend.global.entity.enumeration.FileType;
import com.aicontact.backend.global.repository.MediaFileRepository;
import com.aicontact.backend.global.storage.S3StorageService;
import com.aicontact.backend.global.storage.ThumbnailService;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jcodec.api.JCodecException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaFileService {

    private final S3StorageService storageService;
    private final ThumbnailService thumbnailService;
    private final UserRepository userRepository;
    private final MediaFileRepository mediaFileRepository;
    private final CoupleRepository coupleRepository;

    @Transactional
    public MediaFileDto uploadMedia(MultipartFile file, Long coupleId, Long uploaderId) throws IOException, JCodecException {
        // 1) 키 생성
        String ext      = getExtension(file.getOriginalFilename());
        String uuid     = UUID.randomUUID().toString();
        String key      = String.format("media/couple/%d/%s.%s", coupleId, uuid, ext);
        String thumbKey = String.format("media/couple/%d/%s_thumb.jpg", coupleId, uuid);

        // 2) 원본 업로드
        String fileUrl = storageService.upload(file, key);

        // 3) 썸네일 생성 및 업로드
        byte[] thumbBytes;
        String thumbContentType;
        String contentType = file.getContentType();
        if (contentType != null && contentType.startsWith("image/")) {
            thumbBytes        = thumbnailService.createImageThumbnail(file);
            thumbContentType  = "image/jpeg";
        } else {
            thumbBytes        = thumbnailService.createVideoThumbnail(file);
            thumbContentType  = "image/jpeg";
        }
        String thumbnailUrl = storageService.upload(thumbBytes, thumbKey, thumbContentType);

        // 4) 엔티티 저장
        CoupleEntity couple = coupleRepository.getReferenceById(coupleId);
        UserEntity   uploader = userRepository.getReferenceById(uploaderId);

        MediaFileEntity entity = MediaFileEntity.builder()
                .couple(couple)
                .uploader(uploader)
                .fileUrl(fileUrl)
                .thumbnailUrl(thumbnailUrl)
                .fileType(determineFileType(ext))
                .fileSize(file.getSize())
                .originalFilename(file.getOriginalFilename())
                .s3Key(key)
                .isFavorite(false)
                .uploadDate(LocalDate.now())
                .build();
        mediaFileRepository.save(entity);

        // 5) DTO 반환
        return MediaFileDto.fromEntity(entity);
    }

    @Transactional
    public void deleteMedia(Long mediaId) {
        MediaFileEntity entity = mediaFileRepository.findById(mediaId)
                .orElseThrow(() -> new IllegalArgumentException("미디어를 찾을 수 없습니다. id=" + mediaId));

        String originalKey = entity.getS3Key();



        // 2) 썸네일 URL에서 확장자 추출 (예: "jpg")
        String thumbExt = getExtension(entity.getThumbnailUrl());

        // 3) 원본 키에서 확장자 이전 부분(base)만 취득
        int dotPos = originalKey.lastIndexOf('.');
        String baseKey = (dotPos > 0)
                ? originalKey.substring(0, dotPos)
                : originalKey;

        // 4) 썸네일 키 재조합
        String thumbKey = baseKey + "_thumb." + thumbExt;

        storageService.delete(originalKey);
        storageService.delete(thumbKey);

        System.out.println("originalKey = " + originalKey);
        System.out.println("thumbKey    = " + thumbKey);

        // DB 레코드 삭제
        mediaFileRepository.delete(entity);
    }

    @Transactional
    public Page<MediaFileDto> listFavorites(Pageable pageable,
                                            FileType fileType,
                                            LocalDate dateFrom,
                                            LocalDate dateTo,
                                            Long loggedInCoupleId,
                                            boolean onlyFavorites) {
        // 1) 기본 스펙: 로그인한 커플
        Specification<MediaFileEntity> spec = (root, query, cb) ->
                cb.equal(root.get("couple").get("id"), loggedInCoupleId);

        // 2) 파일 타입 필터
        if (fileType != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("fileType"), fileType));
        }

        // 3) 날짜 범위 필터
        if (dateFrom != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("uploadDate"), dateFrom));
        }
        if (dateTo != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("uploadDate"), dateTo));
        }

        // 4) (선택) 즐겨찾기만 조회
        if (onlyFavorites) {
            spec = spec.and((root, query, cb) ->
                    cb.isTrue(root.get("isFavorite")));
        }

        // 5) 한 번에 조회 + DTO 매핑
        return mediaFileRepository
                .findAll(spec, pageable)
                .map(MediaFileDto::fromEntity);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private FileType determineFileType(String ext) {

        Set<String> VIDEO_EXTENSIONS = Set.of(
                "mp4", "mov", "3gp", "mkv"
        );
        return VIDEO_EXTENSIONS.contains(ext)
                ? FileType.VIDEO
                : FileType.IMAGE;
    }

    public Page<MediaFileDto> findMedia(
            Pageable pageable,
            FileType fileType,
            LocalDate dateFrom,
            LocalDate dateTo,
            Long loggedInCoupleId
    ) {
        Specification<MediaFileEntity> spec = (root, query, cb) -> cb.conjunction();

        // 1) 로그인한 커플 기준 필터
        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("couple").get("id"), loggedInCoupleId));

        // 2) 파일 타입이 들어왔으면 AND
        if (fileType != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("fileType"), fileType));
        }

        // 3) 날짜 범위
        if (dateFrom != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("uploadDate"), dateFrom));
        }
        if (dateTo != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("uploadDate"), dateTo));
        }

        // 4) JPA 조회 + DTO 매핑
        return mediaFileRepository.findAll(spec, pageable)
                .map(MediaFileDto::fromEntity);
    }


    public Page<MediaThumbnailDto> listThumbnails(Long coupleId, int page, int size) {
        Pageable pv = PageRequest.of(page, size, Sort.by("uploadDate").descending());
        return mediaFileRepository.findByCoupleId(coupleId, pv)
                .map(e -> new MediaThumbnailDto(e.getId(), e.getThumbnailUrl(), e.isFavorite(), e.getCreatedAt()));
    }

    public MediaFileDto getMedia(Long coupleId, Long mediaId) {
        MediaFileEntity e = mediaFileRepository.findById(mediaId)
                .filter(m -> m.getCouple().getId().equals(coupleId))
                .orElseThrow(() -> new EntityNotFoundException("미디어를 찾을 수 없습니다."));
        return MediaFileDto.fromEntity(e);
    }

    @Transactional
    public FavoriteResponse toggleFavorite(Long coupleId, Long mediaId) {
        MediaFileEntity e = mediaFileRepository.findById(mediaId)
                .filter(m -> m.getCouple().getId().equals(coupleId))
                .orElseThrow(() -> new EntityNotFoundException("미디어를 찾을 수 없습니다."));
        e.setFavorite(!e.isFavorite());  // 엔티티에 setter 추가 필요
        mediaFileRepository.save(e);
        return new FavoriteResponse(mediaId, e.isFavorite());
    }

    public Page<MediaThumbnailDto> findThumbnails(
            Pageable pageable,
            FileType fileType,
            LocalDate dateFrom,
            LocalDate dateTo,
            Long loggedInCoupleId,
            boolean favoriteOnly
    ) {
        // 1) 기본 spec (로그인한 커플)
        Specification<MediaFileEntity> spec = (root, query, cb) ->
                cb.equal(root.get("couple").get("id"), loggedInCoupleId);

        // 2) fileType 필터
        if (fileType != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("fileType"), fileType));
        }

        // 3) dateFrom
        if (dateFrom != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("uploadDate"), dateFrom));
        }
        // 4) dateTo
        if (dateTo != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("uploadDate"), dateTo));
        }

        // 4) favoriteOnly 필터 (즐겨찾기 탭일 때만)
        if (favoriteOnly) {
            spec = spec.and((root, query, cb) ->
                    cb.isTrue(root.get("isFavorite")));  // entity 의 boolean favorite 필드
        }

        // 5) 조회 + DTO 변환
        return mediaFileRepository.findAll(spec, pageable)
                .map(e -> new MediaThumbnailDto(e.getId(), e.getThumbnailUrl(), e.isFavorite(), e.getCreatedAt()));
    }
}

