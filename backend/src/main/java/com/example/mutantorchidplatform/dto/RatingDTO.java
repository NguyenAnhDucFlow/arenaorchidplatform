package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.RatingName;
import lombok.Data;

@Data
public class RatingDTO {

    private long id;

    private RatingName ratingName;

    private int starCount;

    private int reviewCount;

    private ProductDTO product;
}
