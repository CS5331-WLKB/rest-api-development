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
    password_hash=Column(String(64),nullable=False)
    fullname=Column(String(100),nullable=False)
    age=Column(Integer, nullable=False)

    def hash_password(self,password):
        self.password_hash=pwd_context.encrypt(password)

    def verify_password(self,password):
        return pwd_context.verify(password,self.password_hash)

class Diary(Base):
    __tablename__='diary'

    id=Column(Integer,primary_key=True)
    title=Column(String(100),nullable=False)
    author=Column(String(32),nullable=False)
    publish_date=Column(Date,nullable=False)
    public = Column(Boolean,nullable=False)
    text=Column(String,nullable=False)
    
    @property
    def serialize(self):
        return {
            'id':self.id,
            'title':self.title,
            'author': self.author,
            'publish_date':self.publish_date.isoformat(),
            'public': self.public,
            'text': self.text
        }
        
class Token(Base):
    __tablename__='token'
    id = Column(Integer,primary_key=True)
    uuid=Column(String, index=True,nullable=False)
    expired=Column(Boolean,nullable=False)
    username=Column(String(32),ForeignKey('user.username'))
    user=relationship(User)

engine = create_engine('sqlite:///secretdiary.db')
Base.metadata.create_all(engine)

