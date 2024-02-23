package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT r FROM Category r WHERE r.name LIKE :name")
    Page<Category> searchByName(@Param("name") String name, Pageable pageable);
}
