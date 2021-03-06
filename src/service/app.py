#!/usr/bin/python

from flask import Flask, request, jsonify, abort, g
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from flask_cors import CORS
import json
import os
from models import Base, User, Diary, Token
import uuid
from flask_httpauth import HTTPBasicAuth
from datetime import date
import bleach # santinize library

auth = HTTPBasicAuth()

# Build database connection
engine = create_engine('sqlite:///secretdiary.db')
Base.metadata.bind = engine

session = scoped_session(sessionmaker(bind=engine))

app = Flask(__name__)
# Enable cross origin sharing for all endpoints
CORS(app)

# Remember to update this list
ENDPOINT_LIST = ['/', '/meta/heartbeat', '/meta/members','/users/register',
                 '/users/expire','/users/authenticate','/users','/diary (get)','/diary(post)',
                 '/diary/create','/diary/delete','/diary/permission']

@app.teardown_request
def remove_session(ex=None):
    session.remove()

def verify_password(username, password):
    user = session.query(User).filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return False
    g.user = user
    return True

@app.route("/users/register", methods=['POST'])
def user_registration():
    if request.method == 'POST':
        # santinize user input when registration
        fullname = bleach.clean(request.json.get('fullname'))
        age = bleach.clean(request.json.get('age'))
        username = bleach.clean(request.json.get('username'))
        password = bleach.clean(request.json.get('password'))

        if not fullname or not age or not username or not password:
            if not fullname:
                text = 'Full Name'
            elif not age:
                text = 'Age'
            elif not username:
                text = 'Username'
            elif not password:
                text = 'Password'
            return jsonify({'status': False, 'error': text + ' is required'})

        if session.query(User).filter_by(username=username).first() is not None:
            return jsonify({'status': False, 'error': 'User already exists!'}), 200
        user = User(username=username, fullname=fullname, age=age)
        user.hash_password(password)
        session.add(user)
        session.commit()

        return jsonify({'status': True}), 201

def get_token(username):
    temp_uuid = str(uuid.uuid4())
    newToken = Token(uuid=temp_uuid, expired=False, username=username)
    session.add(newToken)
    session.commit()
    return jsonify({'status': True, 'result':{'token': temp_uuid}}), 200

@app.route('/users/authenticate', methods=['POST'])
def get_authentication():
    username = request.json.get('username')
    password = request.json.get('password')
    if verify_password(username, password):
        return get_token(username)
    else:
        return jsonify({'status': False}), 200

@app.route('/users/expire', methods=['POST'])
def expire_token():
    if request.method == 'POST':
        try:
            temp_uuid = request.json.get('token')
            target = session.query(Token).filter_by(uuid=temp_uuid).first()
            if target:
                target.expired = True
                session.add(target)
                session.commit()
                return jsonify({'status': True}), 200
            else:
                return jsonify({'status': False}), 200
        except:
            return jsonify({'status': False}), 200

@app.route('/users', methods=['POST'])
def get_user():
    if request.method == 'POST':
        curr_uuid = request.json.get('token')
        target = session.query(Token).filter_by(uuid=curr_uuid).first()
        if (not target) or target.expired:
            return jsonify({'status': False, 'error': 'Invalid authentication token.'}), 200
        else:
            username = target.username
            curr_user = session.query(User).filter_by(
                username=username).first()
            return jsonify({'status': True, 'result':{'username': username, 'fullname': curr_user.fullname, 'age': curr_user.age}}), 200

def get_secret_diary():
    curr_token = request.json.get('token')
    target = session.query(Token).filter_by(uuid=curr_token).first()
    if target and not target.expired:
        diaryList = session.query(Diary).filter_by(author=target.username)
        diaryList_serialized = [d.serialize for d in diaryList.all()]
        return jsonify({'status': True, 'result':diaryList_serialized}), 201
    return jsonify({'status': False, 'error': 'Invalid authentication token.'}), 200

@app.route('/diary', methods=['GET','POST'])
def get_diary():
    if request.method == 'GET':
        diaryList = session.query(Diary).filter_by(public=True)
        diaryList_serialized = [d.serialize for d in diaryList.all()]
        return jsonify({'status': True,'result':diaryList_serialized }),200
    else:
        return get_secret_diary()

@app.route('/diary/create', methods=['POST'])
def create_diary():
    if request.method == 'POST':
        curr_token = request.json.get('token')
        target = session.query(Token).filter_by(uuid=curr_token).first()

        if target and not target.expired:
            # santinize diary content when creating diary
            title = bleach.clean(request.json.get('title'))
            public = request.json.get('public')
            text = bleach.clean(request.json.get('text'))
            newDiary = Diary(title=title,author=target.username,publish_date=date.today(),public=public,text=text)
            session.add(newDiary)
            session.commit()
            return jsonify({'status': True}), 201
        else:
            return jsonify({'status': False, 'error': 'Invalid authentication token.'}), 200

@app.route('/diary/delete', methods=['POST'])
def delete_diary():
    if request.method == 'POST':
        curr_token = request.json.get('token')
        target = session.query(Token).filter_by(uuid=curr_token).first()
        if target and not target.expired:
            curr_id = request.json.get('id')
            d = session.query(Diary).filter_by(id=curr_id).first()
            if d:
                session.delete(d)
                session.commit()
                return jsonify({'status': True}), 200
            else:
                return jsonify({'status': False, 'error': 'Diary does not exist.'}), 200
        else:
            return jsonify({'status': False, 'error': 'Invalid authentication token.'}), 200

@app.route('/diary/permission', methods=['POST'])
def change_permission():
    if request.method == 'POST':
        curr_token = request.json.get('token')
        target = session.query(Token).filter_by(uuid=curr_token).first()
        if target and not target.expired:
            public = request.json.get('public')
            id = request.json.get('id')
            d = session.query(Diary).filter_by(id=id).first()
            if d:
                d.public=public
                session.add(d)
                session.commit()
                return jsonify({'status':True}), 200
            else:
                return jsonify({'status':False,'error': 'Diary does not exist'}), 200
        else:
            return jsonify({'status': False, 'error': 'Invalid authentication token.'}), 200

def make_json_response(data, status=True, code=200):
    """Utility function to create the JSON responses."""

    to_serialize = {}
    if status:
        to_serialize['status'] = True
        if data is not None:
            to_serialize['result'] = data
    else:
        to_serialize['status'] = False
        to_serialize['error'] = data
    response = app.response_class(
        response=json.dumps(to_serialize),
        status=code,
        mimetype='application/json'
    )
    return response

@app.route("/")
def index():
    """Returns a list of implemented endpoints."""
    return make_json_response(ENDPOINT_LIST)


@app.route("/meta/heartbeat")
def meta_heartbeat():
    """Returns true"""
    return make_json_response(None)


@app.route("/meta/members")
def meta_members():
    """Returns a list of team members"""
    with open("./team_members.txt") as f:
        team_members = f.read().strip().split("\n")
    return make_json_response(team_members)


if __name__ == '__main__':
    # Change the working directory to the script directory
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)

    # Run the application
    app.run(debug=False, port=8080, host="0.0.0.0")
