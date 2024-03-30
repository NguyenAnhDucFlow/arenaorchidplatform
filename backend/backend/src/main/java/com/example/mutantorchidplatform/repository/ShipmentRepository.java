package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {
}
