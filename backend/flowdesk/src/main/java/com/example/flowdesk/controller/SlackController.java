package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slack")
@CrossOrigin(origins = "http://localhost:5173")
public class SlackController {

    @GetMapping
    public List<Map<String,String>> getMessages() {
        return List.of(
                Map.of("channel","#project-team","message","Urgent bug fix needed"),
                Map.of("channel","#placements","message","Company visiting next week"),
                Map.of("channel","#general","message","Lunch at 1 PM?")
        );
    }
}