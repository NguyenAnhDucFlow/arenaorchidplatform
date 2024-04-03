package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.RatingDTO;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.entity.Rating;
import com.example.mutantorchidplatform.repository.ProductRepository;
import com.example.mutantorchidplatform.repository.RatingRepository;
import jakarta.persistence.NoResultException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RatingService {

    void create(RatingDTO ratingDTO);
}

@Service
class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public void create(RatingDTO ratingDTO) {

        String ratingNameWithStar = ratingDTO.getName() + " Star";
        Rating rating = ratingRepository.findByName(ratingNameWithStar);

        if (rating == null) {
            rating = new Rating();
            rating.setName(ratingDTO.getName());
            rating.setStarCount(0);
            rating.setReviewCount(0);
        }

        Product product = productRepository.findById(ratingDTO.getProduct().getId()).orElseThrow(
                () -> new NoResultException("Product with ID " + ratingDTO.getProduct().getId() + " not found")
        );

        rating.setStarCount(rating.getStarCount() + ratingDTO.getStarValue());
        rating.setReviewCount(rating.getReviewCount() + 1);

        // Calculate the new average rating
        double totalRatingSum = product.getTotalRating() * product.getTotalReview();
        totalRatingSum += ratingDTO.getStarValue();
        double newTotalRating = totalRatingSum / (product.getTotalReview() + 1);
        newTotalRating = roundToHalf(newTotalRating);


        // Update product's total rating and total review count
        product.setTotalRating(newTotalRating);
        product.setTotalReview(product.getTotalReview() + 1);

        // Set the product to the rating
        rating.setProduct(product);

        // Persist changes in the database
        ratingRepository.save(rating);
        productRepository.save(product);
    }

    private double roundToHalf(double value) {
        return Math.round(value * 2) / 2.0;
    }

}
