package com.Fitness.AI_Fitness_Service.controller;

import com.Fitness.AI_Fitness_Service.model.Recommendation;
import com.Fitness.AI_Fitness_Service.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendations(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.getUserRecommendations(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendation(@PathVariable String activityId) {
        return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId));
    }

    @DeleteMapping("/activity/{activityId}")
    public ResponseEntity<String> deleteRecommendationByActivityId(@PathVariable String activityId) {
        recommendationService.deleteRecommendationByActivityId(activityId);
        return ResponseEntity.ok("Recommendation deleted successfully");
    }
}