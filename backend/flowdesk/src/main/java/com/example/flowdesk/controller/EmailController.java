package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    @GetMapping
    public List<Map<String, Object>> getEmails() {
        return List.of(
                Map.of(
                        "id", 1,
                        "from", "Prof. Sharma",
                        "subject", "Urgent: Project Deadline",
                        "preview", "Please submit the final draft by tonight.",
                        "body", "Reminder: Submit project before 11:59 PM.",
                        "time", "9:10 AM",
                        "urgent", true
                ),
                Map.of(
                        "id", 2,
                        "from", "Placement Cell",
                        "subject", "Interview Shortlist",
                        "preview", "You have been shortlisted...",
                        "body", "Congratulations! You are shortlisted.",
                        "time", "8:40 AM",
                        "urgent", true
                )
        );
    }
}
