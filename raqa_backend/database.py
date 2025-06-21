from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
#print("DB_URL environment variable:", os.getenv("DB_URL"))
DB_URL = os.getenv("DB_URL")


# establish database connection
engine = create_engine(DB_URL)
# allow session obejcts to use the engine
local_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)