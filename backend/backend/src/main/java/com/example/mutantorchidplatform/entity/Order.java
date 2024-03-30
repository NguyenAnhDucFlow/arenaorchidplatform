package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "Orders")
@EntityListeners(AuditingEntityListener.class)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private Date date;

    private double total;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String deliveryOption;

    private String paymentOption;

    @ManyToOne
    private Shipment shipment;

    @ManyToOne
    private User customer;

    @ManyToOne
    private User staff;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,
    orphanRemoval = true)//orphanRemoval thường ít dùng thông thường định xóa
        // thì ngta sẽ xóa theo orderDetail ID, chớ không lấy order xong rồi xóa 1 orderDetail trong đấy
        // rồi update thằng order
    private List<OrderDetail> orderDetails;
}
