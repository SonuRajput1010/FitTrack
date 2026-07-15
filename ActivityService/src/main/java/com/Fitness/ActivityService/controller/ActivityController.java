package com.Fitness.ActivityService.controller;

import com.Fitness.ActivityService.dto.ActivityRequest;
import com.Fitness.ActivityService.dto.ActivityResponse;
import com.Fitness.ActivityService.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(
            @Valid @RequestBody ActivityRequest request,
            @RequestHeader("X-USER-ID") String userId) {

        request.setUserId(userId);
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @RequestHeader("X-USER-ID") String userId) {

        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId) {
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }

    @GetMapping("/allActivities")
    public ResponseEntity<List<ActivityResponse>> getActivities() {
        return ResponseEntity.ok(activityService.getActivities());
    }

    @PutMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable String activityId,
            @Valid @RequestBody ActivityRequest request,
            @RequestHeader("X-USER-ID") String userId) {

        request.setUserId(userId);
        return ResponseEntity.ok(activityService.updateActivity(activityId, request));
    }

    @DeleteMapping("/{activityId}")
    public ResponseEntity<String> deleteActivity(@PathVariable String activityId) {
        activityService.deleteActivity(activityId);
        return ResponseEntity.ok("Activity deleted successfully");
    }

    @PostMapping("/{activityId}/regenerate-recommendation")
    public ResponseEntity<String> regenerateRecommendation(@PathVariable String activityId) {
        activityService.regenerateRecommendation(activityId);
        return ResponseEntity.ok("Recommendation regeneration started");
    }
}