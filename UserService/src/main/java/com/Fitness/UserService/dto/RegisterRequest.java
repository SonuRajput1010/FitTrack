package com.Fitness.UserService.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class RegisterRequest {

    @Email(message = "Invalid Email Format")
    private String email;

    private String keycloakId;

    private String firstName;

    private String lastName;

    private Integer age;

    private Double height;

    private Double weight;

    private String goal;

    private String experienceLevel;

    private String bio;

    private Integer weeklyWorkoutGoalMinutes;

    private Integer monthlyCaloriesGoal;

    private Double targetWeight;

    private Integer dailyWaterGoalMl;

    private Double dailySleepGoalHours;
}