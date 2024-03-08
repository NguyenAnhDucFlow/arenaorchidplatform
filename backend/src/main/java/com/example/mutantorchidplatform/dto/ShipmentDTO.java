package com.example.mutantorchidplatform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    private Boolean isDefault;

    @JsonIgnoreProperties("shipments")
    private UserDTO user;
}
