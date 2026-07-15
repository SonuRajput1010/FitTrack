package com.Fitness.AI_Fitness_Service.service;

import com.Fitness.AI_Fitness_Service.model.Recommendation;
import com.Fitness.AI_Fitness_Service.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendations(String userId) {
        log.info("Fetching recommendations for userId={}", userId);
        return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(() ->
                        new RuntimeException("No recommendation found for activityId: " + activityId)
                );
    }

    public void deleteRecommendationByActivityId(String activityId) {
        recommendationRepository.deleteByActivityId(activityId);
        log.info("Recommendation deleted successfully. activityId={}", activityId);
    }
}