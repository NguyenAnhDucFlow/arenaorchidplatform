package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderDetailDTO {

    private Integer id;

    @NotNull
    private int quantity;

    @JsonBackReference
    @NotNull
    private OrderDTO order;

    @NotNull
    private ProductDTO product;
}
