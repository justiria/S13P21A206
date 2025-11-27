package com.aicontact.backend.global.repository;

import com.aicontact.backend.global.entity.MediaFileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MediaFileRepository extends JpaRepository<MediaFileEntity, Long>,
        JpaSpecificationExecutor<MediaFileEntity> {

    Page<MediaFileEntity> findByCoupleIdAndIsFavoriteTrue(
            Long coupleId,
            Pageable pageable
    );
    Page<MediaFileEntity> findByCoupleId(Long coupleId, Pageable pageable);
}
