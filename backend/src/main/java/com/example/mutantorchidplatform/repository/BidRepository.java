package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Integer> {

    List<Bid> findAllByAuctionId(int id);
}
