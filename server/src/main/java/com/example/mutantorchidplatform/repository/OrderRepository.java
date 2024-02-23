package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Auction;
import com.example.mutantorchidplatform.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Integer> {

}
