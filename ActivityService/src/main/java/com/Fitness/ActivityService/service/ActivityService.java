package com.Fitness.ActivityService.service;

import com.Fitness.ActivityService.dto.ActivityRequest;
import com.Fitness.ActivityService.dto.ActivityResponse;
import com.Fitness.ActivityService.model.Activity;
import com.Fitness.ActivityService.repository.ActivityRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Qualifier("aiServiceClient")
    private final WebClient aiServiceClient;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {
        validateUser(request.getUserId());

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        log.info(
                "Activity created successfully. activityId={}, userId={}",
                savedActivity.getId(),
                savedActivity.getUserId()
        );

        publishActivityForRecommendation(savedActivity, "created");

        return mapToResponse(savedActivity);
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        return activityRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ActivityResponse> getActivities() {
        return activityRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ActivityResponse getActivityById(String activityId) {
        return mapToResponse(getActivity(activityId));
    }

    public ActivityResponse updateActivity(String activityId, @Valid ActivityRequest request) {
        validateUser(request.getUserId());

        Activity activity = getActivity(activityId);

        activity.setUserId(request.getUserId());
        activity.setType(request.getType());
        activity.setDuration(request.getDuration());
        activity.setCaloriesBurned(request.getCaloriesBurned());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setAdditionalMetrics(request.getAdditionalMetrics());

        Activity updatedActivity = activityRepository.save(activity);

        log.info(
                "Activity updated successfully. activityId={}, userId={}",
                updatedActivity.getId(),
                updatedActivity.getUserId()
        );

        publishActivityForRecommendation(updatedActivity, "updated");

        return mapToResponse(updatedActivity);
    }

    public void deleteActivity(String activityId) {
        Activity activity = getActivity(activityId);

        deleteRecommendation(activityId);

        activityRepository.deleteById(activity.getId());

        log.info(
                "Activity deleted successfully. activityId={}, userId={}",
                activityId,
                activity.getUserId()
        );
    }

    public void regenerateRecommendation(String activityId) {
        Activity activity = getActivity(activityId);

        publishActivityForRecommendation(activity, "regenerated");

        log.info(
                "Recommendation regeneration requested. activityId={}, userId={}",
                activity.getId(),
                activity.getUserId()
        );
    }

    private void validateUser(String userId) {
        boolean validUser = userValidationService.validateUser(userId);

        if (!validUser) {
            log.warn("Activity request rejected. Invalid userId={}", userId);
            throw new RuntimeException("Invalid user");
        }
    }

    private Activity getActivity(String activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() ->
                        new RuntimeException("Activity not found with id: " + activityId)
                );
    }

    private void deleteRecommendation(String activityId) {
        try {
            aiServiceClient.delete()
                    .uri("/api/recommendations/activity/{activityId}", activityId)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnSuccess(response ->
                            log.info("Recommendation deleted successfully. activityId={}", activityId)
                    )
                    .doOnError(error ->
                            log.error("Failed to delete recommendation. activityId={}", activityId, error)
                    )
                    .onErrorResume(error -> {
                        log.warn(
                                "Continuing activity deletion even though recommendation deletion failed. activityId={}",
                                activityId
                        );
                        return Mono.empty();
                    })
                    .block();
        } catch (Exception exception) {
            log.error(
                    "AI recommendation delete call failed. activityId={}",
                    activityId,
                    exception
            );
        }
    }

    private void publishActivityForRecommendation(Activity activity, String action) {
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, activity);

            log.info(
                    "Published activity to RabbitMQ. action={}, activityId={}, userId={}",
                    action,
                    activity.getId(),
                    activity.getUserId()
            );
        } catch (Exception exception) {
            log.error(
                    "Failed to publish activity to RabbitMQ. action={}, activityId={}",
                    action,
                    activity.getId(),
                    exception
            );
        }
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();

        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setEndTime(activity.getEndTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());

        return response;
    }
}