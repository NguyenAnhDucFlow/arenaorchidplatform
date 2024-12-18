package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "Orders")
public class Order extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private double total;

    private double subtotal;

    private double shipping;

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
