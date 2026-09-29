# CyberMira

> AI-powered cybersecurity knowledge for developers.

CyberMira is an AI-powered cybersecurity assistant for developers. It combines a structured cybersecurity knowledge base with AI to provide practical, evidence-grounded security guidance.

Unlike a general-purpose chatbot, CyberMira retrieves relevant cybersecurity knowledge from a curated Sanity Knowledge Base before generating an answer. The knowledge base connects vulnerabilities, technologies, attack patterns, detection techniques, mitigations, OWASP categories, and trusted security references.

## How It Works

A typical CyberMira request follows this flow:

```text
Developer question
        |
        v
React / Vite frontend
        |
        v
FastAPI backend
        |
        v
Relevant knowledge paths
        |
        v
Sanity Context MCP
        |
        v
CyberMira Knowledge Base
        |
        v
Structured security evidence
        |
        v
Gemini
        |
        v
Grounded security answer
```

The backend first identifies the knowledge areas relevant to the developer's question. It then retrieves structured evidence through Sanity Context before passing that evidence to the language model.

This architecture keeps the cybersecurity knowledge separate from the language generation layer and makes the answer traceable to specific knowledge areas.

## Architecture

* **React / Vite** — developer-facing web interface
* **FastAPI** — backend API and orchestration layer
* **Sanity** — structured cybersecurity knowledge management
* **Sanity Context** — knowledge retrieval through MCP
* **Gemini** — grounded answer generation
* **Docker** — local development and deployment

## Knowledge Base

CyberMira's knowledge base is organized around interconnected cybersecurity concepts:

* Vulnerabilities
* Technologies
* Attack patterns
* Detection techniques
* Mitigations
* OWASP Top 10 categories
* Security references

The initial knowledge base includes security topics such as:

* Broken Object Level Authorization
* API authorization
* SQL injection
* Credential reuse
* Session security
* Authentication hardening
* Authorization testing
* Object ownership testing
* Parameterized query verification

The knowledge model is designed to grow independently from the application code.

## Project Structure

```text
cybermira/
├── apps/
│   ├── api/
│   │   └── app/
│   └── web/
├── sanity/
│   └── studio/
├── data/
│   └── seed/
├── docs/
│   └── architecture.md
├── docker-compose.yml
├── README.md
└── .gitignore
```

### Backend

```text
apps/api/
└── app/
    ├── main.py
    ├── mcp_client.py
    ├── retrieval.py
    └── llm.py
```

The backend is responsible for:

1. Receiving developer questions.
2. Selecting relevant cybersecurity knowledge paths.
3. Retrieving evidence from Sanity Context.
4. Passing the evidence to Gemini.
5. Returning the grounded answer and the knowledge areas used.

### Frontend

```text
apps/web/
└── src/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── types/
    ├── App.tsx
    ├── main.tsx
    └── styles.css
```

The frontend provides the chat experience, conversation persistence, evidence display, suggestion prompts, loading states, and error handling.

## Grounded AI

CyberMira uses retrieval before generation.

The language model receives the retrieved CyberMira evidence as its primary source of truth. The application instructs the model to:

* Base answers on the supplied evidence.
* Avoid unsupported cybersecurity claims.
* Clearly indicate when available evidence is insufficient.
* Prefer defensive security guidance.
* Provide safe verification, detection, and mitigation guidance.
* Reference relevant OWASP and CWE identifiers when available.

This makes the system focused on cybersecurity knowledge rather than generic conversational responses.

## Development

### Backend

```bash
cd apps/api

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

Configure the required environment variables in `.env`:

```env
SANITY_CONTEXT_MCP_URL=
SANITY_ORGANIZATION_TOKEN=
SANITY_KNOWLEDGE_BASE_ID=
GEMINI_API_KEY=
```

Start the API:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd apps/web

npm install
```

Create `.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://127.0.0.1:5173
```

### Sanity Studio

```bash
cd sanity/studio

npm install
npm run dev
```

## Environment Variables

| Variable                    | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `SANITY_CONTEXT_MCP_URL`    | Sanity Context MCP endpoint                                |
| `SANITY_ORGANIZATION_TOKEN` | Organization-level token used to access the Knowledge Base |
| `SANITY_KNOWLEDGE_BASE_ID`  | CyberMira Sanity Context Knowledge Base                    |
| `GEMINI_API_KEY`            | Gemini API authentication                                  |
| `VITE_API_URL`              | Frontend URL of the CyberMira API                          |

Secrets must remain local and must never be committed to the repository.

## Security Scope

CyberMira is designed for defensive cybersecurity education and development.

It focuses on:

* Security analysis
* Vulnerability understanding
* Detection
* Secure development practices
* Authorization and authentication review
* Mitigation guidance
* Security references

The system is not designed to provide instructions for exploiting real systems.

## Documentation

Detailed system architecture is available in:

```text
docs/architecture.md
```

The Sanity Studio contains the schemas used to manage CyberMira's structured cybersecurity knowledge.
