package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
}
