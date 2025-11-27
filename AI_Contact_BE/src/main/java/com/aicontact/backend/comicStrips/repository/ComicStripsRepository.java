package com.aicontact.backend.comicStrips.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aicontact.backend.comicStrips.entity.ComicStripsEntity;

public interface ComicStripsRepository extends JpaRepository<ComicStripsEntity, Long> {

    List<ComicStripsEntity> findAllByCoupleIdOrderByCreatedAtDesc(Long coupleId);

    // 리스트 조회
    List<ComicStripsEntity> findAllByCouple_IdOrderByCreatedAtDesc(Long coupleId);

}
