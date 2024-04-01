package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.dto.TopSellerDTO;
import com.example.mutantorchidplatform.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    @Query("SELECT new com.example.mutantorchidplatform.dto.TopSellerDTO(u.displayName, u.email, p.name, u.country, SUM(od.quantity * od.price), COUNT(od.id)) " +
            "FROM OrderDetail od " +
            "INNER JOIN od.product p " +
            "INNER JOIN od.order o " +
            "INNER JOIN o.customer u " +
            "GROUP BY u.id, p.name " +
            "ORDER BY SUM(od.quantity * od.price) DESC")
    List<TopSellerDTO> findTopSellers();
}
