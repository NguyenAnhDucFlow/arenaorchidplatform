package com.example.mutantorchidplatform.dto;

import lombok.Data;

@Data
public class TopSellerDTO {

    private String ownerName;
    private String ownerEmail;
    private String productName;
    private long quantitySold;
    private double totalSales;

    public TopSellerDTO(String ownerName, String ownerEmail, String productName, long quantitySold, double totalSales) {
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.productName = productName;
        this.quantitySold = quantitySold;
        this.totalSales = totalSales;
    }

    // Getters and Setters
}
