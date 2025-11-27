package com.aicontact.backend.global.dto.response;

import com.aicontact.backend.global.dto.MediaThumbnailDto;
import com.aicontact.backend.global.dto.PaginationInfo;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class MediaThumbnailListResponse {
    private List<MediaThumbnailDto> mediaFiles;
    private final PaginationInfo pagination;

    public MediaThumbnailListResponse(Page<MediaThumbnailDto> page) {
        this.mediaFiles = page.getContent();
        this.pagination = new PaginationInfo(page);
    }
}
