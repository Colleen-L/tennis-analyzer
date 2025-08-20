from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
  # table for storing user login info in the database
  __tablename__ = "users"

  id = Column(Integer, primary_key = True, index = True)
  name = Column(String, index = True)
  email = Column(String, unique = True, index = True)
  password = Column(String, nullable = False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), onupdate=func.now())

  # for password reset
  reset_token = Column(String, nullable=True)
  reset_token_expiry = Column(DateTime(timezone=True), nullable=True)