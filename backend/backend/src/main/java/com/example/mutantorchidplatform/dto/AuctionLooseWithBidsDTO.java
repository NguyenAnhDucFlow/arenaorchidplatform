package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.AuctionStatus;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class AuctionLooseWithBidsDTO {

    private Integer id;

    private Date startDate;

    private Date endDate;

    private String startPrice;

    private String stepPrice;

    private String currentPrice;

    private AuctionStatus status;

    private List<BidLooseDTO> bids;
}
