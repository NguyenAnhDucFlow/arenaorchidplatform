package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.dto.ReviewDTO;
import com.example.mutantorchidplatform.entity.Review;
import com.example.mutantorchidplatform.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @PostMapping("/")
    ResponseDTO<Void> create(@RequestBody @Valid ReviewDTO reviewDTO) {

        reviewService.create(reviewDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @PostMapping("/{reviewId}/helpful")
    public ResponseDTO<?> updateHelpful(@PathVariable int reviewId, @RequestBody Map<String, Boolean> request) {
        boolean isHelpful = request.getOrDefault("isHelpful", false);
        try {
            reviewService.updateHelpful(reviewId, isHelpful);
            return ResponseDTO.builder()
                    .status(200)
                    .msg("Successfully updated helpful count")
                    .build();
        } catch (RuntimeException ex) {
            return ResponseDTO.builder()
                    .status(404)
                    .msg("Review not found")
                    .build();
        }
    }
}
