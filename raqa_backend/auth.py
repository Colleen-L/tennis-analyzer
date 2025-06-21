from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

# secret key used to sign JWTs
SECRET_KEY = os.getenv("SECRET_KEY")
# signing algorithm: HMAC and SHA-256
ALGORITHM = "HS256"
# time in min before tokens expire after creation
ACCESS_TOKEN_MIN = 30


# sets password hashing system with Argon2- secure
password_context = CryptContext(schemes=["argon2"], deprecated="auto")


# function that hashes password using argon2
def hash_password(password: str) -> str:
  return password_context.hash(password)


# function that verifies password to hashed password in db
# returns a boolean depending on if the passwords match or not
def verify_password(plain_password: str, hashed_password: str) -> bool:
  return password_context.verify(plain_password, hashed_password)


# function that creates a JWT
def create_access_token(data: dict) -> str:
  # copies the data to keep the original dictionary unmodified
  to_encode = data.copy()
  # sets expiration timestamp for the token
  expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_MIN)
  to_encode.update({"exp": expire})
  # returns a signed JWT- encoded with secret key and HS256
  return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)