package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    // ---------------- REPLY ENDPOINT ----------------
    @PostMapping("/reply")
    public Map<String, String> generateReply(@RequestBody Map<String, String> request) {

        String from = request.get("from");
        String subject = request.get("subject");

        String prompt = "Write a professional email reply to " + from +
                " regarding the subject: '" + subject +
                "'. Keep it concise and polite.";

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> ollamaRequest = Map.of(
                "model", "llama3",
                "prompt", prompt,
                "stream", false
        );

        Map response = restTemplate.postForObject(
                "http://localhost:11434/api/generate",
                ollamaRequest,
                Map.class
        );

        String aiReply = response.get("response").toString();

        return Map.of("reply", aiReply);
    }


    // ---------------- DAILY BRIEF ENDPOINT ----------------
    @GetMapping("/daily-brief")
    public Map<String, String> generateDailyBrief() {

        String context = """
        Emails:
        - Prof. Sharma: Project deadline tonight 11:59 PM
        - Placement Cell: Interview at 2 PM
        - Newsletter: Monthly update

        Meetings:
        - Project Review at 11 AM
        - Placement Prep at 2 PM

        Slack:
        - Priya: Urgent bug fix
        - Arjun: Lunch plan

        Rank into 3 categories:
        urgent, important, later.
        Return ONLY valid JSON like:
        {
          "urgent": [],
          "important": [],
          "later": []
        }
        """;

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = Map.of(
                "model", "llama3",
                "prompt", context,
                "stream", false
        );

        Map response = restTemplate.postForObject(
                "http://localhost:11434/api/generate",
                request,
                Map.class
        );

        String aiOutput = response.get("response").toString();

        return Map.of("ai_raw_output", aiOutput);
    }
}