package com.example.mutantorchidplatform.dto;

import com.example.mutantorchidplatform.entity.User;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class ShipmentDTO {

    private int id;

    private String addressType;

    private String receiver;

    private String phone;

    private String address;

    private String city;

    private String state;

    private String country;

    private String zipcode;

    private boolean isDefault;

    private UserDTO user;
}
