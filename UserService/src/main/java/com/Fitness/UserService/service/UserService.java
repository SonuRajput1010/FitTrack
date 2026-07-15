package com.Fitness.UserService.service;

import com.Fitness.UserService.dto.RegisterRequest;
import com.Fitness.UserService.dto.UserResponse;
import com.Fitness.UserService.model.User;
import com.Fitness.UserService.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse register(RegisterRequest request) {
        log.info("Register request received. email={}, keycloakId={}",
                request.getEmail(),
                request.getKeycloakId()
        );

        User user = getExistingUserByEmail(request.getEmail());

        if (user == null) {
            user = new User();
        }

        updateUserFields(user, request);

        User savedUser = userRepository.save(user);

        log.info("User saved successfully. id={}, email={}",
                savedUser.getId(),
                savedUser.getEmail()
        );

        return mapToResponse(savedUser);
    }

    public UserResponse getUserProfile(String userId) {
        return mapToResponse(getUserByKeycloakId(userId));
    }

    public Boolean existsByUserId(String userId) {
        log.info("Validating user. keycloakId={}", userId);
        return userRepository.existsByKeycloakId(userId);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UserResponse updateUser(String userId, @Valid RegisterRequest request) {
        User user = getUserByKeycloakId(userId);

        updateUserFields(user, request);

        User updatedUser = userRepository.save(user);

        log.info("User updated successfully. keycloakId={}", userId);

        return mapToResponse(updatedUser);
    }

    public UserResponse updateUserDetails(String userId, RegisterRequest request) {
        User user = getUserByKeycloakId(userId);

        updateUserFields(user, request);

        User updatedUser = userRepository.save(user);

        log.info("User details updated successfully. keycloakId={}", userId);

        return mapToResponse(updatedUser);
    }

    public void deleteUser(String userId) {
        User user = getUserByKeycloakId(userId);

        userRepository.delete(user);

        log.info("User deleted successfully. keycloakId={}", userId);
    }

    private User getExistingUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return userRepository.findByEmail(email).orElse(null);
    }

    private User getUserByKeycloakId(String userId) {
        return userRepository.findByKeycloakId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void updateUserFields(User user, RegisterRequest request) {
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getKeycloakId() != null && !request.getKeycloakId().isBlank()) user.setKeycloakId(request.getKeycloakId());
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getHeight() != null) user.setHeight(request.getHeight());
        if (request.getWeight() != null) user.setWeight(request.getWeight());
        if (request.getGoal() != null) user.setGoal(request.getGoal());
        if (request.getExperienceLevel() != null) user.setExperienceLevel(request.getExperienceLevel());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getWeeklyWorkoutGoalMinutes() != null) user.setWeeklyWorkoutGoalMinutes(request.getWeeklyWorkoutGoalMinutes());
        if (request.getMonthlyCaloriesGoal() != null) user.setMonthlyCaloriesGoal(request.getMonthlyCaloriesGoal());
        if (request.getTargetWeight() != null) user.setTargetWeight(request.getTargetWeight());
        if (request.getDailyWaterGoalMl() != null) user.setDailyWaterGoalMl(request.getDailyWaterGoalMl());
        if (request.getDailySleepGoalHours() != null) user.setDailySleepGoalHours(request.getDailySleepGoalHours());
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setKeycloakId(user.getKeycloakId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setAge(user.getAge());
        response.setHeight(user.getHeight());
        response.setWeight(user.getWeight());
        response.setGoal(user.getGoal());
        response.setExperienceLevel(user.getExperienceLevel());
        response.setBio(user.getBio());
        response.setWeeklyWorkoutGoalMinutes(user.getWeeklyWorkoutGoalMinutes());
        response.setMonthlyCaloriesGoal(user.getMonthlyCaloriesGoal());
        response.setTargetWeight(user.getTargetWeight());
        response.setDailyWaterGoalMl(user.getDailyWaterGoalMl());
        response.setDailySleepGoalHours(user.getDailySleepGoalHours());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}