package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "http://localhost:5173")
public class MeetingController {

    @GetMapping
    public List<Map<String, Object>> getMeetings() {
        return List.of(
                Map.of(
                        "id", 1,
                        "title", "Project Review",
                        "time", "11:00 AM",
                        "duration", "1 hour",
                        "attendees", List.of("Prof. Sharma", "Rahul")
                ),
                Map.of(
                        "id", 2,
                        "title", "Placement Prep",
                        "time", "2:00 PM",
                        "duration", "45 mins",
                        "attendees", List.of("Placement Cell")
                ),
                Map.of(
                        "id", 3,
                        "title", "Office Hours",
                        "time", "4:30 PM",
                        "duration", "30 mins",
                        "attendees", List.of("Prof. Sharma")
                )
        );
    }
}