package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
