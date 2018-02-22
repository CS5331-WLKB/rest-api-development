import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, Date,Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context

Base = declarative_base()

class User(Base):
    __tablename__='user'

    id=Column(Integer,primary_key=True)
    username=Column(String(32),index=True,nullable=False)
    password_hash=Column(String(64))
    fullname=Column(String(32),nullable=False)
    age=Column(Integer)

    def hash_password(self,password):
        self.password_hash=pwd_context.encrypt(password)

    def verify_password(self,password):
        return pwd_context.verify(password,self.password_hash)
    
class Diary(Base):
    __tablename__='diary'

    id=Column(Integer,primary_key=True)
    title=Column(String(100),nullable=False)
    publish_date=Column(Date,nullable=False)
    public = Column(Boolean,nullable=False)
    text=Column(String,nullable=False)

    user_id=Column(Integer,ForeignKey('user.id'))
    user=relationship(User)

engine = create_engine('sqlite:///secretdiary.db')
Base.metadata.create_all(engine)

