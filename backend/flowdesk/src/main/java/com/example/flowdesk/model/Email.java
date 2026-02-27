package com.example.flowdesk.model;

public class Email {

    private Long id;
    private String from;
    private String subject;
    private String body;
    private String time;
    private String priority;

    public Email(Long id, String from, String subject, String body, String time) {
        this.id = id;
        this.from = from;
        this.subject = subject;
        this.body = body;
        this.time = time;
    }

    public Long getId() { return id; }
    public String getFrom() { return from; }
    public String getSubject() { return subject; }
    public String getBody() { return body; }
    public String getTime() { return time; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}