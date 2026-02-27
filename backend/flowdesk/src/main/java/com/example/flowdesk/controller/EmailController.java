package com.example.flowdesk.controller;

import com.example.flowdesk.model.Email;
import com.example.flowdesk.service.EmailClassifierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    @Autowired
    private EmailClassifierService classifierService;

    @GetMapping
    public List<Email> getEmails() {

        List<Email> emails = List.of(
                new Email(
                        1L,
                        "Prof. Sharma",
                        "Urgent: Project Deadline",
                        "Reminder: Submit project before 11:59 PM today.",
                        "9:10 AM"
                ),
                new Email(
                        2L,
                        "Placement Cell",
                        "Interview Shortlist",
                        "Interview scheduled at 2 PM today.",
                        "8:40 AM"
                )
        );

        // 🔥 Hybrid Classification
        for (Email email : emails) {
            String priority = classifierService.classifyEmail(
                    email.getFrom(),
                    email.getSubject(),
                    email.getBody()
            );
            email.setPriority(priority);
        }

        return emails;
    }
}