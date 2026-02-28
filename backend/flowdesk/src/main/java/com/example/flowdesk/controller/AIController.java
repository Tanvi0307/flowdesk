package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.*;
import java.util.regex.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final RestTemplate restTemplate = new RestTemplate();

    // ============================
    // CLASSIFICATION (HYBRID SYSTEM)
    // ============================
    @PostMapping("/classify")
    public List<Map<String, Object>> classifyBatch(
            @RequestBody Map<String, List<Map<String, Object>>> body) {

        List<Map<String, Object>> items = body.get("items");
        List<Map<String, Object>> results = new ArrayList<>();

        for (Map<String, Object> item : items) {

            try {

                String id = item.get("id").toString();
                String content = item.get("content").toString().toLowerCase();

                String priority = null;
                String reason = "";

                // ===============================
                // 1️⃣ TIME EXTRACTION (e.g., "within 2 hours")
                // ===============================
                Pattern hourPattern = Pattern.compile("(\\d+)\\s*hour");
                Matcher hourMatcher = hourPattern.matcher(content);

                if (hourMatcher.find()) {

                    int hours = Integer.parseInt(hourMatcher.group(1));

                    if (hours <= 2) {
                        priority = "urgent";
                        reason = "Deadline within 2 hours";
                    }
                    else if (hours <= 24) {
                        priority = "important";
                        reason = "Deadline within 24 hours";
                    }
                    System.out.println("CONTENT: " + content);
System.out.println("Matched hours: " + hourMatcher.find());
                }

                // ===============================
                // 2️⃣ KEYWORD-BASED RULES
                // ===============================
                if (priority == null) {

                    if (content.contains("server down") ||
                        content.contains("outage") ||
                        content.contains("critical") ||
                        content.contains("emergency") ||
                        content.contains("immediately") ||
                        content.contains("asap")) {

                        priority = "urgent";
                        reason = "Critical keyword detected";
                    }

                    else if (content.contains("review") ||
                             content.contains("meeting") ||
                             content.contains("summary") ||
                             content.contains("report") ||
                             content.contains("deadline") ||
                             content.contains("today")) {

                        priority = "important";
                        reason = "Business importance keyword detected";
                    }
                }

                // ===============================
                // 3️⃣ LLM FALLBACK
                // ===============================
                if (priority == null) {

                    String prompt = """
Classify the following email strictly into:
urgent
important
later

Return only one word.

Email:
""" + content;

                    Map<String, Object> request = new HashMap<>();
                    request.put("model", "phi3:mini");
                    request.put("prompt", prompt);
                    request.put("stream", false);

                    Map<String, Object> options = new HashMap<>();
                    options.put("temperature", 0.0);
                    options.put("num_predict", 20);
                    options.put("num_ctx", 512);

                    request.put("options", options);

                    Map response = restTemplate.postForObject(
                            "http://127.0.0.1:11434/api/generate",
                            request,
                            Map.class
                    );

                    String raw = response.get("response").toString().toLowerCase();

                    if (raw.contains("urgent"))
                        priority = "urgent";
                    else if (raw.contains("important"))
                        priority = "important";
                    else
                        priority = "later";

                    reason = "LLM-based classification";
                }

                Map<String, Object> result = new HashMap<>();
                result.put("id", id);
                result.put("priority", priority);
                result.put("confidence", 95);
                result.put("reason", reason);

                results.add(result);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return results;
    }

    // ============================
    // REPLY GENERATION
    // ============================
    @PostMapping("/reply")
    public Map<String, String> generateReply(@RequestBody Map<String, String> body) {

        try {

            String content = body.get("content");

            String prompt = """
You are a professional email assistant.

Write a concise professional reply.
Maximum 2 sentences.
Maximum 40 words.

Email:
""" + content;

            Map<String, Object> request = new HashMap<>();
            request.put("model", "phi3:mini");
            request.put("prompt", prompt);
            request.put("stream", false);

            Map<String, Object> options = new HashMap<>();
            options.put("temperature", 0.0);
            options.put("num_predict", 60);
            options.put("num_ctx", 512);

            request.put("options", options);

            Map response = restTemplate.postForObject(
                    "http://127.0.0.1:11434/api/generate",
                    request,
                    Map.class
            );

            String reply = "";

            if (response != null && response.get("response") != null) {
                reply = response.get("response").toString().trim();
            }

            return Map.of("reply", reply);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("reply", "Failed to generate reply.");
        }
    }
}