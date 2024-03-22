package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.BidStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BidCreateDTO {

    @NotNull
    private double amount;

    private BidStatus status = BidStatus.PENDING;

    private Long userId;

    private int auctionId;

}
