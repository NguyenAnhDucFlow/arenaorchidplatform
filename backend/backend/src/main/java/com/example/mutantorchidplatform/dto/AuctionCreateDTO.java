package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.AuctionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class AuctionCreateDTO {

    @NotNull
    private Date startDate;

    @NotNull
    private Date endDate;

    private String startPrice;

    private String stepPrice;

    private String currentPrice;

    private AuctionStatus status;

    private Long productId;
}
