package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {

    // Returns today's calendar events.
    // Shape matches what /api/ai/classify expects: each item has `id` + `content`.
    // In production, replace with Google Calendar / Outlook API.
    @GetMapping
    public List<Map<String, Object>> getMeetings() {
        return List.of(
            Map.of(
                "id",        "cal-1",
                "title",     "Daily Standup",
                "time",      "10:00 AM",
                "duration",  "15 min",
                "tag",       "Team",
                "attendees", 8,
                "content",   "Quick team sync on blockers and daily goals. Recurring standup meeting with the full engineering team."
            ),
            Map.of(
                "id",        "cal-2",
                "title",     "Design Review — v2.4",
                "time",      "11:30 AM",
                "duration",  "60 min",
                "tag",       "Product",
                "attendees", 5,
                "content",   "Review updated Figma designs for v2.4 release before dev handoff. Critical milestone before sprint deadline."
            ),
            Map.of(
                "id",        "cal-3",
                "title",     "1:1 — Sarah Chen",
                "time",      "2:00 PM",
                "duration",  "30 min",
                "tag",       "1:1",
                "attendees", 2,
                "content",   "Weekly check-in with Sarah on OKR progress and blockers. Important for performance review cycle."
            ),
            Map.of(
                "id",        "cal-4",
                "title",     "Investor Update Call",
                "time",      "4:00 PM",
                "duration",  "60 min",
                "tag",       "External",
                "attendees", 4,
                "content",   "Quarterly update to investors — Q3 metrics and roadmap preview. Executive presence required, critical external meeting."
            )
        );
    }
}