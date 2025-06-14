from tests.factories import todo_factory
from tests.seed import TODO_COUNT, todos
import pytest

@pytest.mark.asyncio
async def test_get_todo_by_id_returns_200_and_data(client):
    todo_id = todos[0].to_dict().get('id')
    response = await client.get(f"/todos/{todo_id}")

    assert response.status_code == 200
    todo = response.json()
    assert todo.get("id") == todo_id

@pytest.mark.asyncio
async def test_get_todo_by_id_returns_404(client):
    todo_id = TODO_COUNT + 1
    response = await client.get(f"/todos/{todo_id}")

    assert response.status_code == 404

@pytest.mark.asyncio
async def test_put_todo_returns_200_and_data(client):
    todo_id = todos[0].to_dict().get('id')
    todo_dto = {
        'title': "New title",
        'description': "Updated description"
    }

    response = await client.put(f"/todos/{todo_id}", json=todo_dto)

    assert response.status_code == 200
    updated_todo = response.json()

    for key, value in todo_dto.items():
        assert updated_todo[key] == value
    
@pytest.mark.asyncio
async def test_create_todo_returns_201_and_data(client):
    todo_dto = todo_factory().to_dict()
    response = await client.post("/todos", json=todo_dto)

    assert response.status_code == 201
    created_todo = response.json()
    assert created_todo['id'] is not None

@pytest.mark.asyncio
async def test_delete_todo_returns_204(client):
    todo_id = todos[0].to_dict().get('id')
    response = await client.delete(f"/todos/{todo_id}")

    assert response.status_code == 204

@pytest.mark.asyncio
async def test_get_todos_returns_200_and_data(client):
    response = await client.get("/todos")

    assert response.status_code == 200
    todos = response.json()
    assert len(todos) == TODO_COUNT

