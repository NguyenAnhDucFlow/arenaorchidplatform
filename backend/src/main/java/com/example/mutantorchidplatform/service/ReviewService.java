package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.ReviewDTO;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.entity.Review;
import com.example.mutantorchidplatform.repository.ProductRepository;
import com.example.mutantorchidplatform.repository.ReviewRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ReviewService {

    void create(ReviewDTO reviewDTO);
}

@Service
class ReviewServiceImpl implements  ReviewService {

    @Autowired
    ReviewRepository reviewRepository;


    @Autowired
    ModelMapper modelMapper;

    @Override
    @Transactional
    public void create(ReviewDTO reviewDTO) {
        Review review = modelMapper.map(reviewDTO, Review.class);
        reviewRepository.save(review);
    }
}
