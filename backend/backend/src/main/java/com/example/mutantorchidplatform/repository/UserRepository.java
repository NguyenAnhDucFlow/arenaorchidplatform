package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String username);
}
