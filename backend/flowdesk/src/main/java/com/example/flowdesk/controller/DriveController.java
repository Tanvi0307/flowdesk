package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drive")
@CrossOrigin(origins = "http://localhost:5173")
public class DriveController {

    @GetMapping
    public List<Map<String,String>> getFiles() {
        return List.of(
                Map.of("name","Group Project Report.pdf","editedBy","Priya"),
                Map.of("name","Placement Notes.docx","editedBy","Rahul"),
                Map.of("name","Lab Report.pdf","editedBy","You")
        );
    }
}