package com.example.mutantorchidplatform.dto;


import com.example.mutantorchidplatform.entity.enums.InventoryType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Data
public class ProductDTO {

    private long id;

    @Min(0)
    private int available; // số lượng

    private String category;

    private String code;

    private List<String> colors;


    private String cover; // anh hien dau tien trong ds

    @NotBlank
    private String description;

    private String gender;

    private List<String> images;

    @Enumerated(EnumType.STRING)
    private InventoryType inventoryType;

    private String name;

    private String price;

    private String priceSale;

    private List<RatingDTO> ratings;

    @JsonManagedReference //đặt trên "bên chủ" của mối quan hệ (nơi chứa collection).
    // chỉ hoạt động tốt với quan hệ 1 nhiều
    private List<ReviewDTO> reviews;

    private List<String> sizes;

    private String sku;

    private int sold;

    private String status;

    private List<String> tags;

    private float totalRating;

    private double totalReview;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    @JsonIgnore
    private List<MultipartFile> files;

    @ManyToOne
    private UserDTO owner;

    private AuctionLooseDTO auction;
}
