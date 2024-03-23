package com.example.mutantorchidplatform.dto;

import lombok.Data;

@Data
public class UserMetadata {

    private Long id;

    private String displayName;

    private String email;

    private String photoURL;

    private RoleDTO role;

}
