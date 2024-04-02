package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Order;
import com.example.mutantorchidplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerId(Integer customerId);

    @Query("SELECT o FROM Order o JOIN o.orderDetails od JOIN od.product p WHERE p.owner.id = :ownerId")
    List<Order> findOrdersByOwner(@Param("ownerId") long ownerId);


}
