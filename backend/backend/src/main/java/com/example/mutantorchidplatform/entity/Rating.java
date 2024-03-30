package com.example.mutantorchidplatform.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String ratingName;

    private int starCount;

    private int reviewCount;

    @ManyToOne
    private Product product;

    public void setRatingName(String ratingName) {
        this.ratingName = ratingName + " Star";
    }
}
