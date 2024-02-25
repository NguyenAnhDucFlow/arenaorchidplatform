package com.example.mutantorchidplatform.dto;


import com.example.mutantorchidplatform.entity.Rating;
import com.example.mutantorchidplatform.entity.enums.InventoryType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Data
public class ProductDTO {

    private long  id;

    @Min(0)
    private int available; // số lượng

    private String category;

    private String code;

    private List<String> colors;


    private String cover;

    @NotBlank
    private String description;

    private String gender;

    private List<String> images;

    @Enumerated(EnumType.STRING)
    private InventoryType inventoryType;

    private String name;

    private String price;

    private String priceSale;

    private List<Rating> ratings;

    private List<ReviewDTO> reviews;

    private List<String> sizes;

    private String sku;

    private int sold;

    private String status;

    private List<String> tags;

    private float totalRating;

    private double totalReview;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    @JsonIgnore
    private List<MultipartFile> files;

    @ManyToOne
    private UserDTO owner;
}
