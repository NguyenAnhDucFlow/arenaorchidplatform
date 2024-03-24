package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT r FROM Product r WHERE r.name LIKE :name")
    Page<Product> searchByName(@Param("name") String name, Pageable pageable);
    List<Product> findByOwnerId(long ownerId);
    Optional<Product> findByName(String name);
    List<Product> findAllByCategory(String name);
}
