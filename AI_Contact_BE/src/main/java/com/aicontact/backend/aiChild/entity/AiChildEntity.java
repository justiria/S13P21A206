package com.aicontact.backend.aiChild.entity;

import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_children")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AiChildEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // couples 테이블의 id를 외래키로 매핑
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "couple_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ai_child_couple"))
    private CoupleEntity couple;

    @Column(nullable = false, length = 50)
    private String name = "귀요미";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "growth_level", nullable = false)
    private Integer growthLevel = 1;

    @Column(name = "experience_points", nullable = false)
    private Integer experiencePoints = 0;
}