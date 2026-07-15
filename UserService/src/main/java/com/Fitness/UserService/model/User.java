package com.Fitness.UserService.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String keycloakId;

    private String firstName;

    private String lastName;

    private Integer age;

    private Double height;

    private Double weight;

    private String goal;

    private String experienceLevel;

    @Column(length = 1000)
    private String bio;

    private Integer weeklyWorkoutGoalMinutes = 300;

    private Integer monthlyCaloriesGoal = 8000;

    private Double targetWeight;

    private Integer dailyWaterGoalMl = 3000;

    private Double dailySleepGoalHours = 8.0;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}