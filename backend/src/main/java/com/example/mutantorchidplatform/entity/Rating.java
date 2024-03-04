package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.RatingName;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private RatingName ratingName;

    private int starCount;

    private int reviewCount;

    @ManyToOne
    private Product product;
}
