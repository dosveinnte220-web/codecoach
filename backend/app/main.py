from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="CodeCoach AI Execution API", version="0.1.0")


class ExecutionRequest(BaseModel):
    question_id: str = Field(..., description="Stable question identifier.")
    source_code: str = Field(..., min_length=1, description="User-submitted Python code.")
    submission_mode: str = Field(default="run", description="run or submit")
    language: str = Field(default="python", description="Currently supports Python only.")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "engine": "local-development-stub", "message": "This service does not perform unrestricted Python execution."}


@app.post("/api/execute")
def execute(request: ExecutionRequest) -> dict[str, Any]:
    code = request.source_code.strip()
    question_id = request.question_id
    has_function = "def " in code and "return" in code

    return {
        "question_id": question_id,
        "execution_status": "ok",
        "execution_mode": "local-development-stub",
        "secure_runner": "not_available_in_local_dev",
        "passed": 1 if has_function else 0,
        "failed": 0 if has_function else 1,
        "runtime_ms": 18,
        "stdout": "Development stub: sandbox execution is intentionally unavailable in this environment.",
        "stderr": "" if has_function else "No function definition detected. This is a development stub, not a real Python sandbox.",
        "results": [{
            "test_name": "stub_check",
            "passed": has_function,
            "details": "Local dev stub verifies only that the submission includes a Python function skeleton.",
        }],
        "summary": "This output is intentionally stubbed; production deployments should use a Docker sandbox with restricted capabilities.",
    }


@app.post("/api/feedback")
def feedback() -> dict[str, str]:
    return {
        "mode": "deterministic-fallback",
        "correctness": "Review the structure and edge cases before submission.",
        "time_complexity": "O(n) for a typical linear-time solution.",
        "space_complexity": "O(n) in the common hash-map approach.",
        "code_quality": "Improve readability and guard against empty inputs.",
        "edge_cases": "Consider empty lists, single-item arrays, and duplicate values.",
    }
