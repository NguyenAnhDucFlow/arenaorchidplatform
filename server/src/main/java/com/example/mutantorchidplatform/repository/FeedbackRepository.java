package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
}
