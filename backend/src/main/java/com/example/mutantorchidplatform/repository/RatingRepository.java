package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Rating findByRatingName(String ratingName);
}
