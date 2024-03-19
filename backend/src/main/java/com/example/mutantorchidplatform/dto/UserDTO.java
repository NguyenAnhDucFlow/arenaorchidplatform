package com.example.mutantorchidplatform.dto;
import com.example.mutantorchidplatform.entity.Role;
import com.example.mutantorchidplatform.entity.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Data
public class UserDTO {

    private Long id;

    private String about;

    private String address;

    private String city;

    private String company;

    private String country;

    private String displayName;

    @Email
    private String email;

    @JsonProperty("isPublic")
    private boolean isPublic;

    private String password;

    private String phoneNumber;

    private String photoURL;

    @JsonProperty("isVerified")
    private boolean isVerified;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    private List<ShipmentDTO> shipments;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;

    private RoleDTO role;

    private String state;

    private String zipCode;

    @JsonIgnore
    private MultipartFile file;
}
