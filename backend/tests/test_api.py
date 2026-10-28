from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["engine"] == "local-development-stub"


def test_execute_returns_stubbed_result():
    payload = {
        "question_id": "py-fund-01",
        "source_code": "def two_sum(nums, target):\n    return [0, 1]",
        "submission_mode": "run",
        "language": "python",
    }
    response = client.post("/api/execute", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["execution_mode"] == "local-development-stub"
    assert body["secure_runner"] == "not_available_in_local_dev"
