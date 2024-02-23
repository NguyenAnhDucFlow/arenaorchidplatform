package com.example.mutantorchidplatform.repository;

import com.example.mutantorchidplatform.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {
}
