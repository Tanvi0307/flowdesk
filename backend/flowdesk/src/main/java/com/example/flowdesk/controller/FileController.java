package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    @GetMapping
    public List<Map<String, Object>> getFiles() {
        return List.of(
                Map.of(
                        "id", 1,
                        "name", "Group Project Report.pdf",
                        "size", "2.4 MB",
                        "editedBy", "Tanvi",
                        "comments", 5
                ),
                Map.of(
                        "id", 2,
                        "name", "Placement Notes.docx",
                        "size", "1.1 MB",
                        "editedBy", "Rahul",
                        "comments", 2
                ),
                Map.of(
                        "id", 3,
                        "name", "Lab Report.xlsx",
                        "size", "850 KB",
                        "editedBy", "Tanvi",
                        "comments", 1
                )
        );
    }
}