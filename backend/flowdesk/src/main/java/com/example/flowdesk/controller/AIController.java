package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    // ✅ Email Reply Endpoint
    @PostMapping("/reply")
    public Map<String, String> generateReply(@RequestBody Map<String, String> request) {

        String from = request.get("from");
        String subject = request.get("subject");

        String prompt = "Write a professional email reply to " + from +
                " regarding the subject: '" + subject +
                "'. Keep it concise and polite.";

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> ollamaRequest = Map.of(
                "model", "phi3:mini",   // use smaller model
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

    // ✅ Daily Brief Endpoint (stable version)
    @GetMapping("/daily-brief")
    public Map<String, Object> getDailyBrief() {

        return Map.of(
                "urgent", List.of(
                        "Reply to Prof. Sharma before 11:59 PM",
                        "Interview at 2 PM"
                ),
                "important", List.of(
                        "Project Review at 11 AM",
                        "Slack: Priya mentioned you"
                ),
                "later", List.of(
                        "Read College Newsletter",
                        "Update Lab Report"
                )
        );
    }
}