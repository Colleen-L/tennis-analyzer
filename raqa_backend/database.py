from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DB_URL = os.getenv("postgresql://")

# establish database connection
engine = create_engine(DB_URL)
# allow session obejcts to use the engine
local_session = sessionmaker(autocommit = False, autoFlush = False, bind = engine)
