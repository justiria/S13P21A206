package com.aicontact.backend.global.dto.response;

import com.aicontact.backend.global.dto.MediaFileDto;
import com.aicontact.backend.global.dto.PaginationInfo;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class MediaListResponse {
    private final List<MediaFileDto> mediaFiles;

    private final PaginationInfo pagination;

    public MediaListResponse(Page<MediaFileDto> page) {
        this.mediaFiles = page.getContent();
        this.pagination = new PaginationInfo(page);
    }

}
