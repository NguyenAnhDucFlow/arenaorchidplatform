package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.PaymentType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class PaymentDTO {

    private Integer id;

    @NotNull
    private double amount;

    private Date date;

    @NotNull
    private String type;

    @NotNull
    private UserDTO user;

}
