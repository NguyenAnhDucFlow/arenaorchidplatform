package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.PaymentType;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private double amount;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private Date date;

    private String type;

    @ManyToOne
    private User user;
}
