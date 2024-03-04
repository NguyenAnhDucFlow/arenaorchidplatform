package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.RatingDTO;
import com.example.mutantorchidplatform.dto.ResponseDTO;
import com.example.mutantorchidplatform.dto.ReviewDTO;
import com.example.mutantorchidplatform.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    RatingService ratingService;
    @PostMapping("/")
    ResponseDTO<Void> create(@RequestBody @Valid RatingDTO ratingDTO) {

        ratingService.create(ratingDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }
}
