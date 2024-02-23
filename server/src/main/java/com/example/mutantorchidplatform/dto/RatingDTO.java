package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.Product;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class RatingDTO {

    private int id;
    private String name;
    private int starCount;
    private int reviewCount;

    private ProductDTO product;
}
