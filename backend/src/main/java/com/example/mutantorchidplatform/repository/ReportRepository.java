package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Integer> {
}