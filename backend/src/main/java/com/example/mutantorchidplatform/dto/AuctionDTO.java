package com.example.mutantorchidplatform.dto;
import com.example.mutantorchidplatform.entity.enums.AuctionStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class AuctionDTO {

    private Integer id;

    @NotNull
    private Date startDate;

    @NotNull
    private Date endDate;

    @Min(0)
    private double startPrice;

    @Min(0)
    private double stepPrice;

    @Min(0)
    private double currentPrice;

    private AuctionStatus status;

    @NotNull
    private ProductDTO product;

    @NotNull
    private UserDTO staff;
}
