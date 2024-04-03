package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Auction;
import com.example.mutantorchidplatform.entity.Product;
import com.example.mutantorchidplatform.entity.enums.AuctionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {

    @Query("SELECT a FROM Auction a WHERE a.product.name LIKE :name")
    Page<Auction> searchByProductName(@Param("name") String product, Pageable pageable);

    @Query("SELECT a FROM Auction a WHERE a.status = :status ORDER BY a.createdAt DESC LIMIT 10")
    List<Auction> findTop10ByOrderByStartDateDesc(AuctionStatus status);

    @Query("SELECT a FROM Auction a WHERE a.product.id = :id")
    Product findByProductId(Long id);

    @Query("SELECT a FROM Auction a WHERE a.status = :status ORDER BY a.createdAt DESC")
    List<Auction> findByOrderByStartDateDesc(AuctionStatus status);

    @Query("SELECT a FROM Auction a WHERE a.product.owner.id = :ownerId ORDER BY a.createdAt DESC")
    List<Auction> findAllByProduct_Owner_Id(int ownerId);
}
