package com.toddysoft.ui.modules.lessons.repository;

import com.toddysoft.ui.modules.lessons.entity.Couple;
import com.toddysoft.ui.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseCoupleRepository extends JpaRepository<Couple, Long> {
    List<Couple> findByCourse_Id(long courseId);

    @Query("SELECT DISTINCT c.lady FROM Couple c WHERE c.gent.id = :userId AND c.confirmed = true")
    List<User> findLadiesByGentId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT c.gent FROM Couple c WHERE c.lady.id = :userId AND c.confirmed = true")
    List<User> findGentsByLadyId(@Param("userId") Long userId);

}
