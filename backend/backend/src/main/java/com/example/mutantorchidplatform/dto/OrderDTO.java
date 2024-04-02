package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;
import java.util.List;

@Data
public class OrderDTO {

    private Integer id;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date updatedAt;

    @NotNull
    private double total;

    private OrderStatus status = OrderStatus.PENDING;

    private String deliveryOption;

    private String paymentOption;

    private ShipmentDTO shipment;

    @NotNull
    private UserDTO customer;

    private UserDTO staff;

     // nếu không dùng thằng này sẽ không tạo được json, nhớ là có JsonManagedReference thì phải có jsonback, 2 bên tham chiếu ngược nhau nên bỏ 1 bên, bên nào chính thì dùng JsonManagedReference
    private List<OrderDetailDTO> orderDetails;
}
