package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class ReportDTO {

    private Integer id;

    @NotNull
    private String content;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    @NotNull
    private ProductDTO product;

    @NotNull
    private UserDTO user;
}
