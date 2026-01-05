from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.database import get_db
from app.database import Base
import pytest




SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False,expire_on_commit=False)

Base.metadata.create_all(bind=engine)

def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()



@pytest.fixture(scope='module')
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db=TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()



@pytest.fixture(scope='module')
def client(session):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    
