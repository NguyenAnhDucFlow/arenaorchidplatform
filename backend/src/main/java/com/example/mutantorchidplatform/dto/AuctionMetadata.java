package com.example.mutantorchidplatform.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AuctionMetadata {

    private Integer id;

    private Date startDate;

    private Date endDate;

    private double startPrice;

    private double stepPrice;

    private double currentPrice;

    private ProductMetadata product;
}
