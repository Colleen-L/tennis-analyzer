from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from fastapi.middleware.cors import CORSMiddleware
from database import local_session, engine
from models import Base, User
from auth import hash_password, verify_password, create_access_token
from forgot_pass import send_verif_email
import random
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

# automatically creates tables as defined in models.py in db (if it doesn't exist)
Base.metadata.create_all(bind=engine)

# creates new FastAPI application instance
app = FastAPI()

# enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
  CORSMiddleware,
  allow_origins = ["*"], # Change for deployment (but okay for development)
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
# provides SQLAlchemy session (db) and ensures it is closed after use
def get_db():
  db = local_session()
  try:
      yield db
  finally:
      db.close()

# defines expected requests for signup and login
class SignupRequest(BaseModel):
  name: str = Field(..., min_length=1, string_whitespace=True)
  email: EmailStr
  password: str = Field(..., min_length=6, strip_whitespace=True)


class LoginRequest(BaseModel):
  email: str
  password: str = Field(..., min_length=1, strip_whitespace=True)

# signup functionality
@app.post("/signup")
def signup(user_data: SignupRequest, db: Session = Depends(get_db)):

  # print("endpoint called")

  # checks for existing user w/ email
  existing_user = db.query(User).filter(User.email == user_data.email).first()
  if existing_user:
      raise HTTPException(status_code = 400, detail = "Email already registered")
  # hashes the inputted password
  hashed_password = hash_password(user_data.password)
  # creates new User object
  new_user = User(name = user_data.name, email = user_data.email, password = hashed_password)
  # saves new user to database
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  return {"message": "User created!"}


# login functionality
@app.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
  user = db.query(User).filter(User.email == credentials.email).first()
  # checks for correct/valid username and password
  if not user or not verify_password(credentials.password, user.password):
      raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
  token = create_access_token(data={"sub": user.email})
  return {"access_token": token, "token_type": "bearer"}


# verification email; sends the verification code to the email
class EmailRequest(BaseModel):
   email: EmailStr

# sends verification code
@app.post("/send-code")
def send_code(req: EmailRequest, db: Session = Depends(get_db)):
    #checks that the user exists using the inputted email
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # generates random 6 digit code
    code = str(random.randint(100000, 999999))
    expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    user.reset_token = code
    user.reset_token_expiry = expiry
    db.commit()

    try:
        send_verif_email(req.email, code)
        return {"message": "Verification code sent!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send email")

# checks the verification code
class CodeVerificationRequest(BaseModel):
   email: EmailStr
   code: str
  
@app.post("/verify-code")
def verify_code(req: CodeVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or user.reset_token != req.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    expiry = user.reset_token_expiry
    if expiry is None:
        raise HTTPException(status_code=400, detail="Verification code expired")

    # allows for valid time zone comparison
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=ZoneInfo("America/New_York")).astimezone(timezone.utc)

    if expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Verification code expired")

    return {"message": "Verification successful"}

# resets the password
class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=6, strip_whitespace=True)

@app.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    #checks that the user exists using the inputted email
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data.new_password)

    # clears the reset token in db
    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()
    return {"message": "Password reset successful"}