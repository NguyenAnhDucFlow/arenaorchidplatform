package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.FeedbackRating;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Feedback extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private FeedbackRating rating;

    private String review;


    @ManyToOne
    private Product product;

    @ManyToOne
    private User user;




}
