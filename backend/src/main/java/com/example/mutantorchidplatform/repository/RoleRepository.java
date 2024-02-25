package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Query("SELECT r FROM Role r WHERE r.name LIKE :name")
    Page<Role> searchByName(@Param("name") String name, Pageable pageable);

    @Query("SELECT r FROM Role r WHERE r.id =:id")
    Set<Role> searchByID(@Param("id") int id);

}
