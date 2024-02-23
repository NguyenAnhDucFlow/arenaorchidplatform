package com.example.mutantorchidplatform.entity;

import com.example.mutantorchidplatform.entity.enums.ProductStatus;
import com.example.mutantorchidplatform.entity.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends TimeAuditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String about;

    private String address;

    private String city;

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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    private String state;

    private String zipCode;

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    public void setPassword(String password) {
        if (password != null) {
            this.password = PASSWORD_ENCODER.encode(password);
        }
    }

}
