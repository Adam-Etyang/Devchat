package com.Devchat.repository;

import com.Devchat.entity.Update;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface UpdateRepository extends JpaRepository<Update, Long> {

    /**
     * Find all updates created after a specific timestamp
     */
    @Query("SELECT u FROM Update u WHERE u.createdAt > :since ORDER BY u.createdAt DESC")
    List<Update> findUpdatesSince(@Param("since") LocalDateTime since);

    /**
     * Find updates of a specific type created after a timestamp
     */
    @Query("SELECT u FROM Update u WHERE u.type = :type AND u.createdAt > :since ORDER BY u.createdAt DESC")
    List<Update> findUpdatesByTypeSince(@Param("type") String type, @Param("since") LocalDateTime since);

    /**
     * Find the most recent updates (for debugging/testing)
     * Using Spring Data JPA method naming instead of JPQL with LIMIT
     */
    List<Update> findTop10ByOrderByCreatedAtDesc();
}