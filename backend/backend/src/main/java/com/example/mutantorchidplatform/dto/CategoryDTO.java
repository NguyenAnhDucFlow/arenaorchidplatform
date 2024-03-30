package com.example.mutantorchidplatform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryDTO {

    private int id;

    @NotBlank
    private String name;
}
