package com.example.mutantorchidplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopSellerDTO {

    private String sellerName;
    private String email;
    private String productName;
    private String country;
    private double totalSales;
    private long rank; // This could be calculated based on the order in the list if not stored in the DB

    // Constructors, Getters, and Setters
}