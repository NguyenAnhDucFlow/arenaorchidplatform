package com.example.mutantorchidplatform.dto;

import lombok.Data;

@Data
public class RatingDTO {

    private int id;
    private String name;
    private int starCount;
    private int reviewCount;

    private ProductDTO product;
}
