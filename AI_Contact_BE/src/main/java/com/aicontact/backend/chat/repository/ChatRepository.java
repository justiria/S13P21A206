    package com.aicontact.backend.chat.repository;

    import com.aicontact.backend.chat.entity.Chat;
    import com.aicontact.backend.couple.entity.CoupleEntity;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.List;
    import java.util.Optional;

    public interface ChatRepository extends JpaRepository<Chat, Long> {

        List<Chat> findByCoupleIdOrderBySentAtAsc(Long coupleId);

    }
