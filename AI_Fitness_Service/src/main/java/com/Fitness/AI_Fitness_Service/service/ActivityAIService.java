package com.Fitness.AI_Fitness_Service.service;

import com.Fitness.AI_Fitness_Service.model.Activity;
import com.Fitness.AI_Fitness_Service.model.Recommendation;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Recommendation generateRecommendation(Activity activity) {
        try {
            String prompt = createPromptForActivity(activity);
            String aiResponse = geminiService.getAnswer(prompt);

            log.info("AI response received successfully. activityId={}", activity.getId());

            return processAiResponse(activity, aiResponse);
        } catch (Exception exception) {
            log.error("Failed to generate recommendation. activityId={}", activity.getId(), exception);
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            JsonNode analysisJson = objectMapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder recommendation = new StringBuilder();

            addAnalysisSection(recommendation, analysisNode, "overall", "Overall:");
            addAnalysisSection(recommendation, analysisNode, "pace", "Pace:");
            addAnalysisSection(recommendation, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(recommendation, analysisNode, "caloriesBurned", "Calories:");

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(String.valueOf(activity.getType()))
                    .recommendation(recommendation.toString().trim())
                    .improvements(extractImprovements(analysisJson.path("improvements")))
                    .suggestions(extractSuggestions(analysisJson.path("suggestions")))
                    .safety(extractSafetyGuidelines(analysisJson.path("safety")))
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception exception) {
            log.error("Failed to parse AI response. activityId={}", activity.getId(), exception);
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(String.valueOf(activity.getType()))
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();

        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }

        return improvements.isEmpty()
                ? Collections.singletonList("No specific improvements provided")
                : improvements;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();

        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }

        return suggestions.isEmpty()
                ? Collections.singletonList("No specific suggestions provided")
                : suggestions;
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();

        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }

        return safety.isEmpty()
                ? Collections.singletonList("Follow general safety guidelines")
                : safety;
    }

    private void addAnalysisSection(
            StringBuilder recommendation,
            JsonNode analysisNode,
            String key,
            String prefix) {

        if (!analysisNode.path(key).isMissingNode()) {
            recommendation.append(prefix)
                    .append(" ")
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
                {
                  "analysis": {
                    "overall": "Overall analysis here",
                    "pace": "Pace analysis here",
                    "heartRate": "Heart rate analysis here",
                    "caloriesBurned": "Calories analysis here"
                  },
                  "improvements": [
                    {
                      "area": "Area name",
                      "recommendation": "Detailed recommendation"
                    }
                  ],
                  "suggestions": [
                    {
                      "workout": "Workout name",
                      "description": "Detailed workout description"
                    }
                  ],
                  "safety": [
                    "Safety point 1",
                    "Safety point 2"
                  ]
                }

                Analyze this activity:
                Activity Type: %s
                Duration: %d minutes
                Calories Burned: %d
                Additional Metrics: %s

                Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
                Ensure the response follows the EXACT JSON format shown above.
                """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }
}