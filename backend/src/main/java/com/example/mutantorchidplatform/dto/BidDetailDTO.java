package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.BidStatus;
import lombok.Data;

import java.util.Date;

@Data
public class BidDetailDTO {

    private Integer id;

    private double amount;

    private Date updatedAt;

    private BidStatus status;

    private UserMetadata user;

    private AuctionMetadata auction;

}
