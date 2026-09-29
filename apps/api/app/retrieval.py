from collections import OrderedDict


PATHS = [
    "access_control",
    "attack_patterns",
    "authentication/hardening_and_detection",
    "authentication/vulnerabilities",
    "detection",
    "frameworks",
    "injection",
    "mitigation",
    "owasp_top_10",
]


KEYWORDS = OrderedDict(
    {
        "access_control": [
            "authorization",
            "autorisation",
            "access control",
            "contrôle d'accès",
            "bola",
            "idor",
            "object-level",
            "object level",
            "function-level",
            "function level",
            "permission",
            "permissions",
            "privilege",
            "privileges",
            "api authorization",
        ],
        "injection": [
            "sql injection",
            "sqli",
            "injection",
            "query",
            "requête",
            "postgresql",
            "database",
            "base de données",
        ],
        "authentication/vulnerabilities": [
            "authentication",
            "authentification",
            "password",
            "mot de passe",
            "credential",
            "credentials",
            "session",
            "sessions",
            "login",
            "connexion",
            "credential reuse",
        ],
        "authentication/hardening_and_detection": [
            "authentication",
            "authentification",
            "session",
            "sessions",
            "hardening",
            "durcissement",
            "mfa",
            "2fa",
        ],
        "detection": [
            "detect",
            "detection",
            "détection",
            "monitoring",
            "surveillance",
            "log",
            "logs",
            "logging",
            "journalisation",
            "test",
            "testing",
            "tester",
            "verify",
            "vérifier",
        ],
        "mitigation": [
            "mitigation",
            "mitigation",
            "fix",
            "correct",
            "corriger",
            "secure",
            "sécuriser",
            "protection",
            "prevent",
            "prévenir",
        ],
        "attack_patterns": [
            "attack pattern",
            "attaque",
            "attack",
            "manipulation",
            "bypass",
            "contournement",
            "credential reuse",
        ],
        "frameworks": [
            "django",
            "fastapi",
            "react",
            "rest api",
            "api",
            "framework",
        ],
        "owasp_top_10": [
            "owasp",
            "owasp top 10",
            "a01",
            "a02",
            "a03",
            "a04",
            "a05",
            "a06",
            "a07",
            "a08",
            "a09",
            "a10",
            "cwe",
        ],
    }
)


def select_paths(question: str, max_paths: int = 3) -> list[str]:
    question_lower = question.lower()

    scores: dict[str, int] = {
        path: 0
        for path in PATHS
    }

    for path, keywords in KEYWORDS.items():
        for keyword in keywords:
            if keyword in question_lower:
                scores[path] += 1

    ranked = sorted(
        scores.items(),
        key=lambda item: item[1],
        reverse=True,
    )

    selected = [
        path
        for path, score in ranked
        if score > 0
    ][:max_paths]

    if not selected:
        selected = [
            "access_control",
            "detection",
            "mitigation",
        ]

    return selected
