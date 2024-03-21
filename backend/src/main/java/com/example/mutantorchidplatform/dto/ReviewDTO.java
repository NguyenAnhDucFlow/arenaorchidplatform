package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonBackReference //được đặt trên "bên ngược lại" (nơi có tham chiếu đến "bên chủ").
    private ProductDTO product;
}
