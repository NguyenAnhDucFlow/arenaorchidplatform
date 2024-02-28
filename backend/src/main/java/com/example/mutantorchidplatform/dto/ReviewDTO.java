package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class ReviewDTO {

    private int id;
    private String avatarUrl;
    private String comment;
    private int helpful;
    private boolean isPurchased;
    private String name;
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date postedAt;
    private double rating;

    private ProductDTO product;
}