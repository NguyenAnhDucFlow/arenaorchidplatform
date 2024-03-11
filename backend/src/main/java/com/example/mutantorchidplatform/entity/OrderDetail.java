package com.example.mutantorchidplatform.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int quantity;

    private double price;

    @ManyToOne
    private Order order;

    @ManyToOne
    private Product product;
}
