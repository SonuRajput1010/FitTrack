package com.Fitness.UserService.repository;

import com.Fitness.UserService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(String email);

    Boolean existsByKeycloakId(String keycloakId);

    Optional<User> findByEmail(String email);

    Optional<User> findByKeycloakId(String keycloakId);
}