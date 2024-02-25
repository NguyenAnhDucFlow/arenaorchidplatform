package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class BidDTO {

    private Integer id;

    @NotNull
    private double amount;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    @NotBlank
    private String status;

    @NotNull
    private UserDTO user;

    @NotNull
    private AuctionDTO auction;

}
