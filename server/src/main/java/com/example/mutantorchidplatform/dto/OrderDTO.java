package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderDTO {

    private Integer id;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date date;

    @NotNull
    private double total;

    @NotNull
    private OrderStatus status;

    @NotNull
    private UserDTO customer;

    @NotNull
    private UserDTO staff;

    @JsonManagedReference // nếu không dùng thằng này sẽ không tạo được json, nhớ là có JsonManagedReference thì phải có jsonback, 2 bên tham chiếu ngược nhau nên bỏ 1 bên, bên nào chính thì dùng JsonManagedReference
    private List<OrderDetailDTO> orderDetails;
}
