package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class RatingDTO {

    private long id;

    private String ratingName;

    private int starCount;

    private int reviewCount;

    @JsonIgnoreProperties("ratings")
    private ProductDTO product;
}
