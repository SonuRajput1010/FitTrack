package com.Fitness.AI_Fitness_Service.service;

import com.Fitness.AI_Fitness_Service.model.Activity;
import com.Fitness.AI_Fitness_Service.model.Recommendation;
import com.Fitness.AI_Fitness_Service.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService activityAIService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void processActivity(Activity activity) {
        log.info("Received activity for recommendation processing. activityId={}", activity.getId());

        Recommendation generatedRecommendation = activityAIService.generateRecommendation(activity);

        recommendationRepository.findByActivityId(activity.getId())
                .ifPresentOrElse(
                        existingRecommendation -> updateExistingRecommendation(existingRecommendation, generatedRecommendation),
                        () -> createNewRecommendation(generatedRecommendation)
                );
    }

    private void updateExistingRecommendation(
            Recommendation existingRecommendation,
            Recommendation generatedRecommendation) {

        existingRecommendation.setUserId(generatedRecommendation.getUserId());
        existingRecommendation.setActivityType(generatedRecommendation.getActivityType());
        existingRecommendation.setRecommendation(generatedRecommendation.getRecommendation());
        existingRecommendation.setImprovements(generatedRecommendation.getImprovements());
        existingRecommendation.setSuggestions(generatedRecommendation.getSuggestions());
        existingRecommendation.setSafety(generatedRecommendation.getSafety());

        recommendationRepository.save(existingRecommendation);

        log.info(
                "Updated existing recommendation. activityId={}",
                existingRecommendation.getActivityId()
        );
    }

    private void createNewRecommendation(Recommendation recommendation) {
        Recommendation savedRecommendation = recommendationRepository.save(recommendation);

        log.info(
                "Created new recommendation. activityId={}",
                savedRecommendation.getActivityId()
        );
    }
}