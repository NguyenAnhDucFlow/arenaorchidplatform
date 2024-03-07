package com.example.mutantorchidplatform.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne
    private User user;

}
