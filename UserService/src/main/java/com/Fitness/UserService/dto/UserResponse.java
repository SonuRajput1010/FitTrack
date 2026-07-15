package com.Fitness.UserService.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private String id;

    private String keycloakId;

    private String firstName;

    private String lastName;

    private String email;

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

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}