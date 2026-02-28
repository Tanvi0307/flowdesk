package com.example.flowdesk.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.*;
import java.util.regex.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final RestTemplate restTemplate = new RestTemplate();

    // ============================
    // CLASSIFICATION (HYBRID SYSTEM)
    // ============================
    @PostMapping("/classify")
    public List<Map<String, Object>> classifyBatch(
            @RequestBody Map<String, List<Map<String, Object>>> body) {

        List<Map<String, Object>> items = body.get("items");
        List<Map<String, Object>> results = new ArrayList<>();

        for (Map<String, Object> item : items) {

            try {

                String id = item.get("id").toString();
                String content = item.get("content").toString().toLowerCase();

                String priority = null;
                String reason = "";

                // ===============================
                // 1️⃣ TIME EXTRACTION (hours)
                // ===============================
                Pattern hourPattern = Pattern.compile("(\\d+)\\s*hours?");
                Matcher hourMatcher = hourPattern.matcher(content);

                if (hourMatcher.find()) {
                    int hours = Integer.parseInt(hourMatcher.group(1));

                    if (hours <= 2) {
                        priority = "urgent";
                        reason = "Deadline within 2 hours";
                    } else if (hours <= 24) {
                        priority = "important";
                        reason = "Deadline within 24 hours";
                    } else {
                        priority = "later";
                        reason = "Deadline beyond 48 hours";
                    }
                }

                // FIX: Day pattern is now independent of hour pattern (not nested inside it)
                Pattern dayPattern = Pattern.compile("(\\d+)\\s*days?");
                Matcher dayMatcher = dayPattern.matcher(content);

                if (dayMatcher.find()) {
                    int days = Integer.parseInt(dayMatcher.group(1));

                    if (days <= 1) {
                        priority = "urgent";   // FIX: was "Urgent" (capital U) — now lowercase for consistency
                        reason = "Deadline within 1 day";
                    } else if (days <= 3) {
                        priority = "important";
                        reason = "Deadline within 3 days";
                    } else {
                        priority = "later";
                        reason = "Deadline beyond 3 days";
                    }
                }

                // FIX: Removed duplicate hourMatcher.find() debug print (it was always false
                //      because the matcher was already consumed above)
                System.out.println("CONTENT: " + content);

                // ===============================
                // 2️⃣ KEYWORD-BASED RULES
                // ===============================
                if (priority == null) {

                    if (content.contains("server down") ||
                        content.contains("outage") ||
                        content.contains("critical") ||
                        content.contains("emergency") ||
                        content.contains("immediately") ||
                        content.contains("asap")) {

                        priority = "urgent";
                        reason = "Critical keyword detected";

                    } else if (content.contains("review") ||
                               content.contains("meeting") ||
                               content.contains("summary") ||
                               content.contains("report") ||
                               content.contains("deadline") ||
                               content.contains("today")) {

                        priority = "important";
                        reason = "Business importance keyword detected";
                    }
                }

                // ===============================
                // 3️⃣ LLM FALLBACK
                // ===============================
                if (priority == null) {

                    String prompt = """
Classify the following email strictly into:
urgent
important
later

Return only one word.

Email:
""" + content;

                    Map<String, Object> request = new HashMap<>();
                    request.put("model", "phi3:mini");
                    request.put("prompt", prompt);
                    request.put("stream", false);

                    Map<String, Object> options = new HashMap<>();
                    options.put("temperature", 0.0);
                    options.put("num_predict", 20);
                    options.put("num_ctx", 512);

                    request.put("options", options);

                    Map response = restTemplate.postForObject(
                            "http://127.0.0.1:11434/api/generate",
                            request,
                            Map.class
                    );

                    String raw = response.get("response").toString().toLowerCase();

                    if (raw.contains("urgent"))
                        priority = "urgent";
                    else if (raw.contains("important"))
                        priority = "important";
                    else
                        priority = "later";

                    reason = "LLM-based classification";
                }

                Map<String, Object> result = new HashMap<>();
                result.put("id", id);
                result.put("priority", priority);
                result.put("confidence", 95);
                result.put("reason", reason);

                results.add(result);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return results;
    }

    // ============================
    // REPLY GENERATION
    // ============================
    @PostMapping("/reply")
    public Map<String, String> generateReply(@RequestBody Map<String, String> body) {

        try {

            String content = body.get("content");

            String prompt = """
You are a professional email assistant.

Write a concise professional reply.
Maximum 2 sentences.
Maximum 40 words.

Email:
""" + content;

            Map<String, Object> request = new HashMap<>();
            request.put("model", "phi3:mini");
            request.put("prompt", prompt);
            request.put("stream", false);

            Map<String, Object> options = new HashMap<>();
            options.put("temperature", 0.0);
            options.put("num_predict", 60);
            options.put("num_ctx", 512);

            request.put("options", options);

            Map response = restTemplate.postForObject(
                    "http://127.0.0.1:11434/api/generate",
                    request,
                    Map.class
            );

            String reply = "";

            if (response != null && response.get("response") != null) {
                reply = response.get("response").toString().trim();
            }

            return Map.of("reply", reply);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("reply", "Failed to generate reply.");
        }
    }

    // ============================
    // DRIVE CLASSIFICATION (HYBRID)
    // ============================
    @PostMapping("/classify-drive")
    public List<Map<String, Object>> classifyDrive(
            @RequestBody Map<String, List<Map<String, Object>>> body) {

        List<Map<String, Object>> items = body.get("items");
        List<Map<String, Object>> results = new ArrayList<>();

        for (Map<String, Object> item : items) {

            try {

                String id = item.get("id").toString();
                String content = item.get("content").toString().toLowerCase();

                String priority = null;
                String reason = "";

                // ===============================
                // 1️⃣ TIME DETECTION (hours)
                // ===============================
                Pattern hourPattern = Pattern.compile("(\\d+)\\s*hours?");
                Matcher matcher = hourPattern.matcher(content);

                if (matcher.find()) {
                    int hours = Integer.parseInt(matcher.group(1));

                    if (hours <= 2) {
                        priority = "urgent";
                        reason = "Drive file deadline within 2 hours";
                    } else if (hours <= 24) {
                        priority = "important";
                        reason = "Drive file deadline within 24 hours";
                    } else {
                        priority = "later";
                        reason = "Drive file deadline beyond 48 hours";
                    }
                }

                // FIX: Day pattern block now properly closed — keyword and LLM blocks
                //      are no longer incorrectly nested inside the if (dayMatcher.find()) block
                Pattern dayPattern = Pattern.compile("(\\d+)\\s*days?");
                Matcher dayMatcher = dayPattern.matcher(content);

                if (dayMatcher.find()) {
                    int days = Integer.parseInt(dayMatcher.group(1));

                    if (days <= 1) {
                        priority = "important";
                        reason = "Deadline within 1 day";
                    } else if (days <= 3) {
                        priority = "important";
                        reason = "Deadline within 3 days";
                    } else {
                        priority = "later";
                        reason = "Deadline beyond 3 days";
                    }
                } // FIX: closing brace was missing — everything below was trapped inside this block

                // ===============================
                // 2️⃣ KEYWORD RULES
                // ===============================
                if (priority == null) {

                    if (content.contains("incident") ||
                        content.contains("outage") ||
                        content.contains("critical") ||
                        content.contains("immediate") ||
                        content.contains("failure")) {

                        priority = "urgent";
                        reason = "Critical document detected";

                    } else if (content.contains("report") ||
                               content.contains("review") ||
                               content.contains("financial") ||
                               content.contains("summary") ||
                               content.contains("board")) {

                        priority = "important";
                        reason = "Business report detected";
                    }
                }

                // ===============================
                // 3️⃣ LLM FALLBACK
                // ===============================
                if (priority == null) {

                    String prompt = """
Classify this document strictly into:
urgent
important
later

Return only one word.

Document:
""" + content;

                    Map<String, Object> request = new HashMap<>();
                    request.put("model", "phi3:mini");
                    request.put("prompt", prompt);
                    request.put("stream", false);

                    Map<String, Object> options = new HashMap<>();
                    options.put("temperature", 0.0);
                    options.put("num_predict", 20);
                    options.put("num_ctx", 512);

                    request.put("options", options);

                    Map response = restTemplate.postForObject(
                            "http://127.0.0.1:11434/api/generate",
                            request,
                            Map.class
                    );

                    String raw = response.get("response").toString().toLowerCase();

                    if (raw.contains("urgent"))
                        priority = "urgent";
                    else if (raw.contains("important"))
                        priority = "important";
                    else
                        priority = "later";

                    reason = "LLM-based classification";
                }

                Map<String, Object> result = new HashMap<>();
                result.put("id", id);
                result.put("priority", priority);
                result.put("confidence", 95);
                result.put("reason", reason);

                results.add(result);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return results;
    }

    // ============================
    // SLACK CLASSIFICATION
    // ============================
    @PostMapping("/classify-slack")
public List<Map<String, Object>> classifySlack(
        @RequestBody Map<String, List<Map<String, Object>>> body) {

    List<Map<String, Object>> items = body.get("items");
    List<Map<String, Object>> results = new ArrayList<>();

    for (Map<String, Object> item : items) {

        String id = item.get("id").toString();
        String message = item.get("message").toString().toLowerCase();

        String tag = "informational";

        if (message.contains("urgent") ||
            message.contains("deadline") ||
            message.contains("immediately") ||
            message.contains("no extension")) {

            tag = "urgent";

        } else if (message.contains("shift") ||
                   message.contains("reschedule") ||
                   message.contains("meeting")) {

            tag = "meeting-change";

        } else if (message.contains("upload") ||
                   message.contains("register") ||
                   message.contains("submit")) {

            tag = "action";

        } else if (message.contains("review") ||
                   message.contains("important")) {

            tag = "important";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("aiTag", tag);
        result.put("confidence", 95);

        results.add(result);
    }

    return results;
}

    // ============================
    // DAILY BRIEF
    // ============================
    @PostMapping("/daily-brief")
    public Map<String, Object> dailyBrief(
            @RequestBody Map<String, List<Map<String, Object>>> body) {

        List<Map<String, Object>> items = body.get("items");

        List<String> urgentList = new ArrayList<>();
        List<String> importantList = new ArrayList<>();
        List<String> laterList = new ArrayList<>();

        if (items == null) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("urgent", urgentList);
            empty.put("important", importantList);
            empty.put("later", laterList);
            return empty;
        }

        for (Map<String, Object> item : items) {

            String content = item.get("content") != null
                    ? item.get("content").toString()
                    : "No content";

            String priority = item.get("priority") != null
                    ? item.get("priority").toString().toLowerCase()
                    : "";

            if (content.length() > 80) {
                content = content.substring(0, 80) + "...";
            }

            if ("urgent".equals(priority)) {
                urgentList.add(content);
            } else if ("important".equals(priority)) {
                importantList.add(content);
            } else if ("later".equals(priority)) {
                laterList.add(content);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("urgent", urgentList);
        result.put("important", importantList);
        result.put("later", laterList);

        return result;
    }
    @PostMapping("/slack-reply")
public Map<String, String> generateSlackReply(
        @RequestBody Map<String, String> body) {

    try {

        String message = body.get("message");

        if (message == null || message.isEmpty()) {
            return Map.of("reply", "No message provided.");
        }

        String prompt = """
Write a short professional Slack reply in one sentence.
Message:
""" + message;

        Map<String, Object> request = new HashMap<>();
        request.put("model", "phi3:mini");
        request.put("prompt", prompt);
        request.put("stream", false);

        Map response = restTemplate.postForObject(
                "http://127.0.0.1:11434/api/generate",
                request,
                Map.class
        );

        if (response == null || response.get("response") == null) {
            return Map.of("reply", "AI service not responding.");
        }

        String reply = response.get("response").toString().trim();

        return Map.of("reply", reply);

    } catch (Exception e) {
        e.printStackTrace();
        return Map.of("reply", "Slack reply generation failed.");
    }
}
}