package com.toddysoft.ui.validation.repository;

import com.toddysoft.ui.validation.entity.ValidationRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Optional;

public interface ValidationRequestRepository extends CrudRepository<ValidationRequest, Integer> {

    Optional<ValidationRequest> findByTokenCode(String tokenCode);

    @Modifying
    @Transactional
    @Query("DELETE FROM ValidationRequest vt WHERE vt.created < :date")
    void deleteCreatedBefore(@Param("date") Calendar date);

}
