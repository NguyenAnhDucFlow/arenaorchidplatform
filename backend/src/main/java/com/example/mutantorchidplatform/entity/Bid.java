package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.BidStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Bid extends TimeAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private double amount;

    @Enumerated(EnumType.STRING)
    private BidStatus status;

    @ManyToOne
    private User user;

    @ManyToOne
    private Auction auction;

}
