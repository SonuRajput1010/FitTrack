package com.Fitness.gateway.user;

import lombok.Data;

@Data
public class RegisterRequest {

    private String email;

    private String keycloakId;

    private String firstName;

    private String lastName;
}