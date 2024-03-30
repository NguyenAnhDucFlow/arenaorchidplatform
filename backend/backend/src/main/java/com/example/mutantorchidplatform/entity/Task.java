package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Task extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;


    @ManyToOne
    private User manager;

    @ManyToOne
    private User staff;
}
