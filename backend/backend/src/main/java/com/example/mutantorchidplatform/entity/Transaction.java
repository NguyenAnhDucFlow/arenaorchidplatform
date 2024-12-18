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
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private double amount;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private Date date;

    @Enumerated(EnumType.STRING)
    private PaymentType type;

    @ManyToOne
    private User user;

    @ManyToOne
    private Order order;


}
