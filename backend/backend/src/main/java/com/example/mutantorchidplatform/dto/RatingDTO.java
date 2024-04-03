package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
public class RatingDTO {

    private long id;

    private String name;

    private int starCount;

    private int starValue;

    private int reviewCount;

    @JsonIgnoreProperties("ratings")
    private ProductDTO product;
}
