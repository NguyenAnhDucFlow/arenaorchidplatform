package com.example.mutantorchidplatform.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String avatarUrl;
    private String comment;
    private int helpful;
    private boolean isPurchased;
    private String name;
    @CreatedDate
    @Column(updatable = false, nullable = false)
    private Date postedAt;
    private double rating;

    @ManyToOne
    private Product product;
}
