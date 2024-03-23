package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.BidStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class BidCreateDTO {

    @NotNull
    private double amount;

    @Enumerated(EnumType.STRING)
    private BidStatus status = BidStatus.PENDING;

    private Integer userId;

    private Date auctionEndDate;

    private int auctionId;

}
