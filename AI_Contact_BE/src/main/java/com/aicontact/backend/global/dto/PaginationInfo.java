package com.aicontact.backend.global.dto;

import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
public class PaginationInfo {
    private final int currentPage;
    private final int totalPages;
    private final long totalItems;
    private final boolean hasNext;
    private final boolean hasPrevious;

    public PaginationInfo(Page<?> page) {
        this.currentPage = page.getNumber() + 1;        // 1-based
        this.totalPages  = page.getTotalPages();
        this.totalItems  = page.getTotalElements();
        this.hasNext     = page.hasNext();
        this.hasPrevious = page.hasPrevious();
    }
}
