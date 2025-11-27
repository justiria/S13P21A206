package com.aicontact.backend.global.controller;


import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.aiChild.service.AiChildService;
import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.global.dto.MediaFileDto;
import com.aicontact.backend.global.dto.MediaSearchCondition;
import com.aicontact.backend.global.dto.MediaThumbnailDto;
import com.aicontact.backend.global.dto.response.*;
import com.aicontact.backend.global.service.MediaFileService;
import com.aicontact.backend.user.dto.UserDto;
import com.aicontact.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.jcodec.api.JCodecException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaFileService mediaFileService;
    private final UserService userService;
    private final AiChildService aiChildService;

    /** 1) 이미지 업로드 → POST /api/v1/media/images */
    @PostMapping(path = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaFileDto>> uploadImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file
    ) throws IOException, JCodecException {

        String email = userDetails.getUserEntity().getEmail();
        UserDto me = userService.getUserByEmail(email);
        Long uploaderId = me.getId();
        Long coupleId = me.getCoupleId();

        MediaFileDto dto = mediaFileService.uploadMedia(file, coupleId, uploaderId);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();

        AiChildEntity myChild = aiChildService.updateChildPoints(me.getCoupleId(),20);
        return ResponseEntity
                .created(location)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, dto));
    }

    /** 2) 비디오 업로드 → POST /api/v1/media/videos */
    @PostMapping(path = "/videos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaFileDto>> uploadVideo(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file
    ) throws IOException, JCodecException {
        // 구현은 이미지 업로드와 동일하게 서비스에 위임
        return uploadImage(userDetails, file);
    }

    /** 3) media 삭제 → DELETE /api/v1/media/{id} (200 OK) */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<DeleteMediaResponse>> deleteMedia(@PathVariable("id") Long id) throws IOException {
        mediaFileService.deleteMedia(id);

        DeleteMediaResponse payload = new DeleteMediaResponse(
                "미디어 파일이 성공적으로 삭제되었습니다.",
                id
        );
        ApiResponse<DeleteMediaResponse> response = new ApiResponse<>(true, payload);

        // 삭제 성공 시 본문을 내려주려면 200 OK 로 바꿔야 합니다.
        return ResponseEntity.ok(response);
    }

    /** 4) 찜한 미디어 조회 → GET /api/v1/media/favorites?coupleId=xxx&page=0&size=20 */
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<MediaListResponse>> listFavorites(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "page",  defaultValue = "0")  int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            @ModelAttribute MediaSearchCondition cond
    ) {

        String email = userDetails.getUserEntity().getEmail();
        UserDto me = userService.getUserByEmail(email);
        Long coupleId = me.getCoupleId();

        Pageable pageable = PageRequest.of(page, limit, Sort.by("uploadDate").descending());
        Page<MediaFileDto> pageResult = mediaFileService.listFavorites(
                pageable,
                cond.getFileType(),
                cond.getDateFrom(),
                cond.getDateTo(),
                coupleId,
                true
        );

        MediaListResponse body = new MediaListResponse(pageResult);
        ApiResponse<MediaListResponse> response = ApiResponse.success(body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<MediaListResponse>> getMedia(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "page",  defaultValue = "0")  int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            @ModelAttribute MediaSearchCondition cond
    ) {

        String email = userDetails.getUserEntity().getEmail();
        UserDto me = userService.getUserByEmail(email);
        Long coupleId = me.getCoupleId();

        Pageable pageable = PageRequest.of(page, limit, Sort.by("uploadDate").descending());
        Page<MediaFileDto> pageResult = mediaFileService.findMedia(
                pageable,
                cond.getFileType(),
                cond.getDateFrom(),
                cond.getDateTo(),
                coupleId
        );

        MediaListResponse body = new MediaListResponse(pageResult);
        ApiResponse<MediaListResponse> response = ApiResponse.success(body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/thumbnails")
    public ResponseEntity<ApiResponse<MediaThumbnailListResponse>> getThumbnails(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
            @RequestParam(value = "favoriteOnly", defaultValue = "false") boolean favoriteOnly,
            @ModelAttribute MediaSearchCondition cond
    ) {

        String email = userDetails.getUserEntity().getEmail();
        UserDto me = userService.getUserByEmail(email);
        Long coupleId = me.getCoupleId();

        // 1) sortDir → Sort.Direction
        Sort.Direction dir = "asc".equalsIgnoreCase(sortDir)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(dir,"uploadDate"));
        Page<MediaThumbnailDto> pageResult = mediaFileService.findThumbnails(
                pageable,
                cond.getFileType(),
                cond.getDateFrom(),
                cond.getDateTo(),
                coupleId,
                favoriteOnly
        );

        MediaThumbnailListResponse body = new MediaThumbnailListResponse(pageResult);
        ApiResponse<MediaThumbnailListResponse> response = ApiResponse.success(body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MediaFileDto>> getMedia(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id
    ) {

        String email = userDetails.getUserEntity().getEmail();
        UserDto me = userService.getUserByEmail(email);
        Long coupleId = me.getCoupleId();

        MediaFileDto dto = mediaFileService.getMedia(coupleId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, dto));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<FavoriteResponse>> toggleFavorite(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("id") Long id
    ) throws IOException {
        String email = userDetails.getUserEntity().getEmail();
        UserDto me = userService.getUserByEmail(email);
        Long coupleId = me.getCoupleId();

        FavoriteResponse resp = mediaFileService.toggleFavorite(coupleId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, resp));
    }
}