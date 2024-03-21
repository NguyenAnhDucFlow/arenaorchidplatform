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
            Review updatedReview = reviewService.updateHelpful(reviewId, isHelpful);
            // Để giảm thiểu rủi ro về an toàn thông tin, bạn có thể chọn không trả lại toàn bộ đối tượng Review
            return ResponseDTO.builder()
                    .status(200)
                    .msg("Successfully updated helpful count")
                    .data(updatedReview) // Tùy chọn: cung cấp thông tin cụ thể hoặc trả về null
                    .build();
        } catch (RuntimeException ex) {
            // Bắt và xử lý exception nếu review không tìm thấy hoặc có lỗi khác
            return ResponseDTO.builder()
                    .status(404)
                    .msg("Review not found")
                    .build();
        }
    }
}
