package com.example.mutantorchidplatform.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishListDTO {

    private Integer id;

    @NotNull
    private UserDTO user;

    @NotNull
    private ProductDTO product;

}
