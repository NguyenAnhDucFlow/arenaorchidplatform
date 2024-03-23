package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Set;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String about;

    private String address;

    private String city;

    private String company;

    private String country;

    private String displayName;

    @Column(unique = true)
    private String email;

    private Boolean isPublic;

    @Column(nullable = false)
    private String password;

    private String phoneNumber;

    private String photoURL;

    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "user")
    private List<Shipment> shipments;

    private int defaultShipmentId;

    @ManyToOne
    private Role role;

    private String state;

    private String zipCode;

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    public void setPassword(String password) {
        if (password != null) {
            this.password = PASSWORD_ENCODER.encode(password);
        }
    }

}
