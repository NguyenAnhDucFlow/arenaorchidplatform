package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class TaskDTO {

    private Integer id;

    @NotNull
    private String content;

    @NotNull
    private TaskStatus status;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    @NotNull
    private UserDTO manager;

    @NotNull
    private UserDTO staff;
}
