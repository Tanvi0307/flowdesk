package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:5173")
public class CalendarController {

    @GetMapping
    public List<Map<String, String>> getMeetings() {
        return List.of(
                Map.of("time","11:00 AM","title","Project Review"),
                Map.of("time","2:00 PM","title","Placement Prep"),
                Map.of("time","4:30 PM","title","Office Hours")
        );
    }
}