package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.AuctionStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Auction extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Date startDate;

    private Date endDate;

    private double startPrice;

    private double stepPrice;

    private double currentPrice;

    @Enumerated(EnumType.STRING)
    private AuctionStatus status;

    @ManyToOne
    private Product product;

    @ManyToOne
    private User staff;
}
