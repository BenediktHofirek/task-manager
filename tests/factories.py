from app.models import Todo
from faker import Faker
import random

fake = Faker()

def todo_factory():
    return Todo(
        title = fake.sentence(nb_words=6),
        description = fake.paragraph(nb_sentences=3),
        is_completed = random.choice([True, False]),
        due_date = fake.date_between(start_date="today", end_date="+30d") if random.choice([True, False]) else None
    )
