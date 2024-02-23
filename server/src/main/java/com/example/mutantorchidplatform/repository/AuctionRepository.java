package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Auction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {

    @Query("SELECT a FROM Auction a WHERE a.product.name LIKE :name")
    Page<Auction> searchByProductName(@Param("name") String product, Pageable pageable);
}
