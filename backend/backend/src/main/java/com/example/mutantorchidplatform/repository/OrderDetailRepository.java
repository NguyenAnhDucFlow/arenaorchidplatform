package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.dto.TopSellerDTO;
import com.example.mutantorchidplatform.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    @Query("SELECT new com.example.mutantorchidplatform.dto.TopSellerDTO(" +
            "p.owner.displayName, p.owner.email, p.name, SUM(od.quantity), SUM(od.quantity * od.price)) " +
            "FROM OrderDetail od " +
            "INNER JOIN od.product p " +
            "GROUP BY p.owner.id, p.name " +
            "ORDER BY SUM(od.quantity * od.price) DESC")
    List<TopSellerDTO> findTopSellers();


}
