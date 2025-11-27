package com.aicontact.backend.global.dto;

import com.aicontact.backend.global.entity.MediaFileEntity;
import com.aicontact.backend.global.entity.enumeration.FileType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class MediaFileDto {
    private Long id;
    private String fileUrl;
    private String thumbnailUrl;
    private FileType fileType;
    private boolean isFavorite;
    private LocalDate uploadDate;

    public static MediaFileDto fromEntity(MediaFileEntity e) {
        return new MediaFileDto(
                e.getId(),
                e.getFileUrl(),
                e.getThumbnailUrl(),
                e.getFileType(),
                e.isFavorite(),
                e.getUploadDate()
        );
    }
}
