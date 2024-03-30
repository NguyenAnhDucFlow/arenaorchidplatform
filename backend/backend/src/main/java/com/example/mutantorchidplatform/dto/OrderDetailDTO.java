package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderDetailDTO {

    private Integer id;

    @NotNull
    private int quantity;

    private double price;

    @JsonIgnoreProperties("orderDetails")
    private OrderDTO order;

    @NotNull
    private ProductDTO product;
}
