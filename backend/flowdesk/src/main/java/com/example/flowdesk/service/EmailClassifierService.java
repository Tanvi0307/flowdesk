package com.example.flowdesk.service;

import org.springframework.stereotype.Service;

@Service
public class EmailClassifierService {

    public String classifyEmail(String from, String subject, String body) {

        int score = 0;
        String text = (subject + " " + body).toLowerCase();

        if (text.contains("urgent")) score += 3;
        if (text.contains("deadline")) score += 4;
        if (text.contains("today")) score += 3;
        if (from.toLowerCase().contains("prof")) score += 2;

        if (score >= 7) return "urgent";
        if (score >= 4) return "important";
        return "later";
    }
}