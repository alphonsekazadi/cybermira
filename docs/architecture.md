# CyberMira Architecture

## 1. Overview

CyberMira is an AI-powered cybersecurity knowledge assistant for developers.

The system combines a structured cybersecurity knowledge base managed with Sanity, Sanity Context for knowledge retrieval, a FastAPI orchestration layer, and Gemini for answer generation.

The architecture separates **knowledge retrieval** from **language generation**.

```text
                         CyberMira
                             |
             +---------------+---------------+
             |                               |
             v                               v
      React / Vite                     Sanity Studio
      Web Application                  Knowledge Management
             |                               |
             |                               v
             |                    CyberMira Knowledge Base
             |                               |
             v                               |
        FastAPI API <------------------------+
             |
             v
      Retrieval Layer
             |
             v
     Sanity Context MCP
             |
             v
    Structured Evidence
             |
             v
          Gemini
             |
             v
      Grounded Answer
             |
             v
      React / Vite UI
```

## 2. Architectural Principles

CyberMira is built around several principles.

### Knowledge before generation

The language model should not be treated as the primary cybersecurity knowledge source.

For each question, CyberMira first identifies relevant knowledge areas and retrieves structured evidence from the CyberMira Knowledge Base.

### Separation of concerns

Each major component has a specific responsibility:

* React handles the user experience.
* FastAPI handles application orchestration.
* The retrieval layer selects relevant knowledge.
* Sanity stores structured cybersecurity knowledge.
* Sanity Context exposes knowledge to the application through MCP.
* Gemini generates the final natural-language response.

### Grounded responses

The model receives retrieved evidence as part of the generation context.

The application instructs the model to avoid unsupported claims and to explicitly indicate when the available evidence is insufficient.

### Extensible knowledge

Cybersecurity knowledge is stored independently from the application code.

New vulnerabilities, technologies, attack patterns, detection techniques, mitigations, and references can therefore be added without rewriting the application architecture.

---

## 3. System Components

### 3.1 React / Vite Frontend

The frontend is the primary interface for developers.

Responsibilities include:

* Displaying the CyberMira interface.
* Sending security questions to the API.
* Displaying generated answers.
* Rendering structured answer content.
* Displaying the knowledge areas used as evidence.
* Persisting conversations locally.
* Providing suggested security questions.
* Handling loading and error states.
* Allowing users to copy generated answers.

The frontend is intentionally separated into reusable components.

```text
apps/web/src/
├── components/
│   ├── Background.tsx
│   ├── ChatComposer.tsx
│   ├── ChatMessage.tsx
│   ├── Conversation.tsx
│   ├── EvidenceCard.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── MarkdownText.tsx
│   └── SuggestionCards.tsx
├── hooks/
│   └── useChat.ts
├── lib/
│   └── storage.ts
├── types/
│   └── chat.ts
├── App.tsx
├── main.tsx
└── styles.css
```

Conversation state is managed by the `useChat` hook.

Browser `localStorage` is used to preserve the conversation between page reloads.

---

## 4. FastAPI Backend

The FastAPI application acts as the orchestration layer between the frontend, Sanity Context, and Gemini.

```text
apps/api/app/
├── main.py
├── mcp_client.py
├── retrieval.py
└── llm.py
```

### `main.py`

Defines the HTTP API and application-level orchestration.

Main endpoints include:

```text
GET  /health
GET  /api/mcp/context
POST /api/chat
```

The main chat flow is:

```text
POST /api/chat
      |
      v
Validate request
      |
      v
Select relevant knowledge paths
      |
      v
Read knowledge through MCP
      |
      v
Extract evidence
      |
      v
Generate grounded answer
      |
      v
Return answer + knowledge paths
```

### `retrieval.py`

The retrieval layer determines which knowledge areas should be queried based on the user's question.

CyberMira currently uses a lightweight keyword-based routing strategy.

For example:

```text
Question:
"What is BOLA and how can I detect it in a REST API?"

        |
        v

Relevant concepts:
- BOLA
- object-level authorization
- detection
- REST API

        |
        v

Selected knowledge paths:
- access_control
- detection
- frameworks
```

The selected paths are then passed to Sanity Context.

This routing layer is intentionally independent from the MCP client, allowing the retrieval strategy to evolve without changing the rest of the system.

---

## 5. Sanity Knowledge Layer

Sanity is used as the structured knowledge management system for CyberMira.

The knowledge model contains several document types:

```text
Vulnerability
     |
     +---- OWASP Category
     |
     +---- Technology
     |
     +---- Attack Pattern
     |
     +---- Detection Technique
     |
     +---- Mitigation
     |
     +---- Source Reference
```

### Knowledge types

#### Vulnerabilities

Represent concrete security weaknesses.

Examples:

* Broken Object Level Authorization
* Missing Function Level Authorization
* SQL Injection
* Credential Reuse
* Weak Session Management
* API Authorization Bypass

#### Technologies

Represent technologies or application environments where security concepts apply.

Examples:

* REST API
* React
* FastAPI
* Django
* PostgreSQL

#### Attack Patterns

Represent common patterns associated with security weaknesses.

Examples:

* Authorization Boundary Bypass
* Object Identifier Manipulation
* Injected Query Input
* Credential Reuse

#### Detection Techniques

Represent defensive approaches for identifying security weaknesses.

Examples:

* Authorization Matrix Testing
* Object Ownership Testing
* Parameterized Query Verification
* Authentication Event Audit

#### Mitigations

Represent defensive measures used to reduce or eliminate security risks.

Examples:

* Enforce Authorization Server-Side
* Enforce Object-Level Authorization
* Use Parameterized Queries
* Harden Authentication and Sessions

#### OWASP Categories

Represent the relevant OWASP Top 10 categories.

#### Source References

Represent trusted security references used by the knowledge base.

Examples:

* OWASP Top 10
* Common Weakness Enumeration
* MITRE ATT&CK

---

## 6. Sanity Context and MCP

Sanity Context provides the retrieval interface between the CyberMira backend and the structured knowledge base.

CyberMira accesses the Sanity Context MCP endpoint using authenticated JSON-RPC requests.

```text
FastAPI
   |
   | JSON-RPC / MCP
   v
Sanity Context
   |
   v
CyberMira Knowledge Base
```

The backend uses the following MCP capabilities:

```text
initial_context
knowledge_base_read
```

`initial_context` provides the available context and knowledge structure.

`knowledge_base_read` retrieves content from selected knowledge paths.

The MCP client is implemented in:

```text
apps/api/app/mcp_client.py
```

The client sends requests using the MCP protocol version configured for the Sanity Context endpoint.

The backend intentionally keeps the MCP implementation isolated from the rest of the application.

---

## 7. Retrieval Flow

CyberMira does not send every available document to Gemini for every request.

Instead, the retrieval layer selects relevant knowledge paths.

```text
User question
      |
      v
Keyword analysis
      |
      v
Knowledge path scoring
      |
      v
Top relevant paths
      |
      v
Sanity Context MCP
      |
      v
Structured evidence
```

Current knowledge paths include:

```text
access_control
attack_patterns
authentication/hardening_and_detection
authentication/vulnerabilities
detection
frameworks
injection
mitigation
owasp_top_10
```

Each path contains structured knowledge related to a specific security domain.

If no strong keyword match is found, CyberMira falls back to a small set of general security paths:

```text
access_control
detection
mitigation
```

This provides a useful baseline while keeping retrieval focused.

---

## 8. LLM Generation

Gemini is used after retrieval.

The model does not receive the user's question alone. It receives both:

1. The user's question.
2. The evidence retrieved from the CyberMira Knowledge Base.

Conceptually:

```text
Question
   +
Retrieved evidence
   +
CyberMira system instructions
   |
   v
Gemini
   |
   v
Grounded answer
```

The generation instructions require the model to:

* Use the supplied CyberMira evidence as the primary source of truth.
* Avoid inventing unsupported cybersecurity facts.
* State when available evidence is insufficient.
* Distinguish documented evidence from interpretation.
* Prefer defensive security guidance.
* Focus on safe verification, detection, and mitigation.
* Mention relevant OWASP and CWE identifiers when supported by the evidence.
* Avoid instructions for exploiting real systems.
* Respond in English.

This creates a clear boundary between **retrieval** and **generation**.

---

## 9. Chat API Contract

### Request

```http
POST /api/chat
Content-Type: application/json
```

Request body:

```json
{
  "message": "What is BOLA and how can I detect it in a REST API?"
}
```

### Response

```json
{
  "message": "What is BOLA and how can I detect it in a REST API?",
  "answer": "Generated security guidance...",
  "knowledge_paths": [
    "access_control",
    "detection",
    "frameworks"
  ]
}
```

The `knowledge_paths` field allows the frontend to communicate which CyberMira knowledge areas contributed to the response.

---

## 10. Frontend Conversation Flow

When a user submits a question:

```text
User
 |
 v
ChatComposer
 |
 v
useChat()
 |
 v
POST /api/chat
 |
 v
FastAPI
 |
 v
Sanity Context + Gemini
 |
 v
ChatResponse
 |
 v
useChat()
 |
 +----> Add assistant message
 |
 +----> Store conversation locally
 |
 +----> Display answer
 |
 +----> Display evidence paths
```

Conversation messages are stored in browser local storage under:

```text
cybermira-conversation
```

This allows the current conversation to survive a browser refresh without requiring a database-backed user account.

---

## 11. Security Model

CyberMira is designed as a defensive cybersecurity assistant.

The system prioritizes:

* Vulnerability understanding
* Secure development
* Detection
* Verification
* Authentication review
* Authorization review
* Mitigation
* Security references

The backend does not intentionally expose credentials or other secret configuration values through the frontend.

Sensitive configuration is provided through environment variables.

```text
SANITY_CONTEXT_MCP_URL
SANITY_ORGANIZATION_TOKEN
SANITY_KNOWLEDGE_BASE_ID
GEMINI_API_KEY
```

These values must remain outside version control.

The Sanity organization token is used exclusively by the backend to access the Context Knowledge Base and must never be exposed to the browser.

---

## 12. Deployment Model

The project is organized so that the main application services can be run independently or together.

```text
                    Docker / Deployment
                           |
             +-------------+-------------+
             |                           |
             v                           v
       CyberMira API              CyberMira Web
          FastAPI                   React / Vite
             |
             v
       External Services
        /             \
       v               v
   Sanity Context    Gemini
```

Sanity Studio and the Sanity platform provide the knowledge management layer rather than being tightly coupled to the frontend runtime.

---

## 13. Project Structure

```text
cybermira/
├── apps/
│   ├── api/
│   │   └── app/
│   │       ├── main.py
│   │       ├── mcp_client.py
│   │       ├── retrieval.py
│   │       └── llm.py
│   │
│   └── web/
│       └── src/
│           ├── components/
│           ├── hooks/
│           ├── lib/
│           ├── types/
│           ├── App.tsx
│           ├── main.tsx
│           └── styles.css
│
├── sanity/
│   └── studio/
│       └── schemaTypes/
│
├── data/
│   └── seed/
│       ├── attack-patterns.ndjson
│       ├── detection-techniques.ndjson
│       ├── mitigations.ndjson
│       ├── owasp-categories.ndjson
│       ├── references.ndjson
│       ├── technologies.ndjson
│       └── vulnerabilities.ndjson
│
├── docs/
│   └── architecture.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 14. Design Rationale

The architecture intentionally avoids putting cybersecurity knowledge directly into application prompts or source code.

Instead:

```text
Knowledge
   |
   v
Sanity
   |
   v
Sanity Context
   |
   v
Retrieval
   |
   v
Gemini
```

This provides several advantages:

* Knowledge can be updated independently of the application.
* Retrieved evidence can be inspected.
* Different security domains can be queried selectively.
* The LLM remains focused on reasoning and communication.
* The application can expose the knowledge areas used for each response.
* The knowledge model can grow without requiring changes to the frontend.

The result is a system where **structured cybersecurity knowledge is a first-class application component rather than hidden inside an LLM prompt**.
