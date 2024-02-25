package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p FROM Payment p WHERE p.date >= :date")
    Page<Payment> searchByDate(@Param("date") Date s, Pageable pageable);
}
