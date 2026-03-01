# Flowdesk

**Flowdesk** is an AI-powered productivity dashboard that brings your inbox, Slack messages, Drive files, calendar, and tasks into a single unified interface. It uses a hybrid AI classification engine — combining rule-based heuristics with a local LLM (via Ollama) — to automatically prioritize your work and help you focus on what matters most.

---

## Features

- **Smart Inbox** — Emails are automatically classified as `urgent`, `important`, or `later` using a hybrid rule + LLM engine.
- **Slack Integration** — Messages are tagged as `urgent`, `action`, `meeting-change`, `important`, or `informational`.
- **Drive** — Documents are prioritized by content analysis and deadline detection
- **Daily Brief** — A summarized digest of all classified items across every module.
- **AI Reply Generation** — One-click professional reply drafting for emails and Slack messages, powered by a local LLM.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React 19, Vite 7, plain CSS          |
| Backend   | Java 17, Spring Boot 3.2, Maven      |
| AI Engine | Ollama (`phi3:mini` model), local REST API |

---

## Project Structure

```
flowdesk-main/
├── backend/
│   └── flowdesk/
│       ├── pom.xml
│       └── src/main/java/com/example/flowdesk/
│           ├── FlowdeskApplication.java
│           ├── config/
│           │   └── CorsConfig.java
│           ├── controller/
│           │   ├── AIController.java        # Classification & reply generation
│           │   ├── CalendarController.java
│           │   ├── DriveController.java
│           │   ├── EmailController.java
│           │   ├── FileController.java
│           │   ├── MeetingController.java
│           │   └── SlackController.java
│           ├── model/
│           │   └── Email.java
│           └── service/
│               └── EmailClassifierService.java
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── BriefSidebar.jsx
        │   ├── CalendarPanel.jsx
        │   ├── DailyBrief.jsx
        │   ├── Drive.jsx
        │   ├── EmailCard.jsx
        │   ├── EmailList.jsx
        │   ├── EmailModal.jsx
        │   ├── EmailView.jsx
        │   ├── Inbox.jsx
        │   ├── LoginPage.jsx
        │   ├── Sidebar.jsx
        │   └── Slack.jsx
        └── pages/
            ├── CalendarPage.jsx
            ├── DrivePage.jsx
            ├── InboxPage.jsx
            └── SlackPage.jsx
```

---

## Prerequisites

Before running Flowdesk, make sure you have the following installed:

- **Java 17+**
- **Maven 3.8+** (or use the included `mvnw` wrapper)
- **Node.js 18+** and **npm**
- **Ollama** — for local LLM inference

### Install and start Ollama with the required model

```bash
# Install Ollama from https://ollama.com
ollama pull phi3:mini
ollama serve
```

Ollama must be running on `http://127.0.0.1:11434` before starting the backend.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/flowdesk.git
cd flowdesk/flowdesk-main
```

### 2. Start the Backend

```bash
cd backend/flowdesk
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**.

> On Windows, use `mvnw.cmd spring-boot:run` instead.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**.

---

## API Reference

All backend endpoints are prefixed with `/api`.

### AI Endpoints — `POST /api/ai/...`

| Endpoint              | Description                                                  |
|-----------------------|--------------------------------------------------------------|
| `/classify`           | Classify a batch of emails into `urgent`, `important`, `later` |
| `/classify-drive`     | Classify Drive documents by priority                        |
| `/classify-slack`     | Tag Slack messages (`urgent`, `action`, `meeting-change`, etc.) |
| `/daily-brief`        | Aggregate classified items into a daily summary             |
| `/reply`              | Generate a professional email reply via LLM                 |
| `/slack-reply`        | Generate a short Slack reply via LLM                        |

### Other Endpoints

| Endpoint            | Method | Description              |
|---------------------|--------|--------------------------|
| `/api/emails`       | GET    | Fetch and classify emails |
| `/api/calendar`     | GET    | Get upcoming meetings    |
| `/api/slack`        | GET    | Fetch Slack messages     |

---

## How the AI Classification Works

Flowdesk uses a **three-tier hybrid classification pipeline**:

1. **Time-based detection** — Regex patterns extract deadlines from email/document content (e.g., "2 hours", "1 day") and map them to a priority.
2. **Keyword rules** — High-signal words like `urgent`, `outage`, `critical`, `meeting`, `review`, and `deadline` directly assign a priority without needing the LLM.
3. **LLM fallback** — If neither rule fires, the content is sent to `phi3:mini` via the Ollama API, which returns a single-word classification (`urgent`, `important`, or `later`).

This hybrid approach keeps latency low for most items while retaining LLM intelligence for ambiguous cases.

---

## Configuration

Backend configuration lives in:

```
backend/flowdesk/src/main/resources/application.properties
```

By default, it only sets the application name. You can add custom properties here, such as a different server port:

```properties
spring.application.name=flowdesk
server.port=8080
```

CORS is configured in `CorsConfig.java` to allow requests from the frontend during development.

---

## Development Notes

- The frontend uses **Vite** for fast HMR during development. The `npm run build` command produces a production-ready bundle.
- The backend uses **Lombok** for boilerplate reduction in model classes. Make sure your IDE has the Lombok plugin enabled.
- All AI calls go to Ollama locally — **no external API keys are required**.

---

## License

This project is open source. See [LICENSE](LICENSE) for details.
