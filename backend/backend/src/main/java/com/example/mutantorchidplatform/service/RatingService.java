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
    private ProductRepository productRepository;  // Giả sử bạn có ProductService để quản lý sản phẩm

    @Override
    @Transactional
    public void create(RatingDTO ratingDTO) {
        // Tìm kiếm hoặc tạo mới Rating dựa trên RatingName và Product
        Rating rating = ratingRepository.findByRatingNameAndProductId(ratingDTO.getRatingName(), ratingDTO.getProduct().getId());

        if (rating == null) {
            rating = modelMapper.map(ratingDTO, Rating.class);
            rating.setStarCount(ratingDTO.getStarCount());
            rating.setReviewCount(1); // Vì là rating mới, count là 1
        } else {
            // Cập nhật thông tin cho rating đã tồn tại
            rating.setStarCount(rating.getStarCount() + ratingDTO.getStarCount());
            rating.setReviewCount(rating.getReviewCount() + 1);
        }

        // Lấy sản phẩm và cập nhật thông tin rating
        Product product = productRepository.findById(ratingDTO.getProduct().getId()).orElseThrow(NoResultException::new);
        rating.setProduct(product);

        // Cập nhật tổng số rating và review cho sản phẩm
        product.updateTotalRating();
        product.incrementReviewCount();

        // Lưu cập nhật
        ratingRepository.save(rating);
        product.updateTotalRating();  // Tính toán lại totalRating sau khi tất cả updates hoàn tất
        productRepository.save(product);
    }
}
