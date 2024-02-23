package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.FeedbackRating;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class FeedbackDTO {

    private Integer id;

    @NotNull
    private FeedbackRating rating;

    @NotBlank
    private String review;


    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    @NotNull
    private ProductDTO product;

    @NotNull
    private UserDTO user;

}
