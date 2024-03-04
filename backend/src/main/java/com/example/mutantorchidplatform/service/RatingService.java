package com.example.mutantorchidplatform.service;

import com.example.mutantorchidplatform.dto.RatingDTO;
import com.example.mutantorchidplatform.dto.ReviewDTO;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.entity.Rating;
import com.example.mutantorchidplatform.repository.RatingRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

public interface RatingService {

    void create(RatingDTO ratingDTO);
}

@Service
class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Override
    @Transactional
    public void create(RatingDTO ratingDTO) {

        Rating rating = ratingRepository.findByRatingName(ratingDTO.getRatingName());

        if (rating == null) {
            rating = new Rating();
            rating.setRatingName(ratingDTO.getRatingName());
            rating.setStarCount(0);
            rating.setReviewCount(0);
        }

        rating.setStarCount(rating.getStarCount() + 1);
        rating.setReviewCount(rating.getReviewCount() + 1);

        Product product = modelMapper.map(ratingDTO.getProduct(), Product.class);
        rating.setProduct(product);

        ratingRepository.save(rating);
    }

}
