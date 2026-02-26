package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class SlackController {

    @GetMapping
    public List<Map<String, Object>> getMessages() {
        return List.of(
                Map.of(
                        "id", 1,
                        "channel", "#project",
                        "sender", "Priya",
                        "preview", "Need urgent fix!",
                        "time", "10:30 AM",
                        "unread", true
                ),
                Map.of(
                        "id", 2,
                        "channel", "#placements",
                        "sender", "Placements Admin",
                        "preview", "Interview slot update.",
                        "time", "9:50 AM",
                        "unread", true
                ),
                Map.of(
                        "id", 3,
                        "channel", "#general",
                        "sender", "Arjun",
                        "preview", "Team lunch today?",
                        "time", "Yesterday",
                        "unread", false
                )
        );
    }
}