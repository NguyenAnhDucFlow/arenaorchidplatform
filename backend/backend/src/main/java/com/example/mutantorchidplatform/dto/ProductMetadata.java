package com.example.mutantorchidplatform.dto;


import com.example.mutantorchidplatform.entity.enums.InventoryType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class ProductMetadata {

    private long id;

    private int available; // số lượng

    private String category;

    private String code;

    private String cover; // anh hien dau tien trong ds

    private InventoryType inventoryType;

    private String name;

    private String price;

    private String priceSale;

    private String sku;

    private int sold;

    private String status;

    private float totalRating;

    private double totalReview;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;
}
