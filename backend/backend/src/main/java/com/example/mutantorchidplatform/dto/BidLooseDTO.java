package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.BidStatus;
import lombok.Data;

import java.util.Date;

@Data
public class BidLooseDTO {

    private Integer id;

    private double amount;

    private Date createdAt;
    private Date updatedAt;

    private BidStatus status;

    private UserMetadata user;
}
