package com.example.mutantorchidplatform.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private int starCount;

    private int reviewCount;

    @ManyToOne
    private Product product;

    public void setName(String name) {
        this.name = name + " Star";
    }
}
