#!/usr/bin/python

from flask import Flask, request,jsonify, abort, g
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_cors import CORS
import json
import os
from models import Base, User, Diary, Token
import uuid
from flask_httpauth import HTTPBasicAuth
from datetime import date

auth = HTTPBasicAuth()

# Build database connection
engine = create_engine('sqlite:///secretdiary.db')
Base.metadata.bind=engine
DBSession = sessionmaker(bind=engine)
session = DBSession()


app = Flask(__name__)
# Enable cross origin sharing for all endpoints
CORS(app)

# Remember to update this list
ENDPOINT_LIST = ['/', '/meta/heartbeat', '/meta/members','/users/register']


@auth.verify_password
def verify_password(username,password):
    user = session.query(User).filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return False
    g.user=user
    return True

@app.route("/users/register",methods=['POST'])
def user_registration():
    print request.json
    if request.method == 'POST':
        username=request.json.get('username')
        password=request.json.get('password')
        fullname=request.json.get('fullname')
        age=request.json.get('age')

        if username is None or password is None or fullname is None:
            print 'missing required field'
            abort(400)

        if session.query(User).filter_by(username=username).first() is not None:
            return jsonify({'status':False,'error':'User already exists!'}),200#
        user = User(username=username, fullname=fullname,age=age)
        user.hash_password(password)
        session.add(user)
        session.commit()

        return jsonify({'status':True}),201#

def get_token(username):
    temp_uuid = str(uuid.uuid4())
    newToken = Token(uuid=temp_uuid,expired=False,username=username)
    session.add(newToken)
    session.commit()
    return jsonify({'status':True, 'token':temp_uuid}), 200#
    
@app.route('/users/authenticate',methods=['POST'])
def get_authentication():
    username = request.json.get('username')
    password = request.json.get('password')
    if verify_password(username,password):
        return get_token(username)
    else:
        return jsonify({'status': False}), 200#

@app.route('/users/expire',methods=['POST'])
def expire_token():
    if request.method=='POST':
        try:
            temp_uuid = request.json.get('token')
            target = session.query(Token).filter_by(uuid=temp_uuid).first()
            if target:
                target.expired=True
                session.add(target)
                session.commit()
                return jsonify({'status':True}),200#
            else:
                return jsonify({'status':False}),200#
        except:
            return jsonify({'status':False}),200#

@app.route('/users',methods=['POST'])
#@auth.login_required
def get_user():
    if request.method == 'POST':
        curr_uuid = request.json.get('token')
        target = session.query(Token).filter_by(uuid = curr_uuid).first()
        if (not target) or target.expired:
            return jsonify({'status': False,'error':'Invalid authentication token.'}),200#
        else:
            username =target.username
            curr_user = session.query(User).filter_by(username=username).first()
            return jsonify({'status':True, 'username':username, 'fullname': curr_user.fullname, 'age': curr_user.age}),200#

#@auth.login_required
def get_secret_diary():
    curr_token = request.json.get('token')
    target = session.query(Token).filter_by(uuid=curr_token).first()
    if target and not target.expired:
        diaryList = session.query(Diary).filter_by(author=target.username)
        if diaryList.first():
            diaryList_serialized = [d.serialize for d in diaryList.all()]
            return jsonify({'status': True, 'result':diaryList_serialized}), 201#
        else:
            return jsonify({'status': True, 'result':[]}), 201#
    return jsonify({'status': False, 'error': 'Invalid authentication token.'}), 200#
    
        
@app.route('/diary', methods=['GET','POST'])
def get_diary():
    if request.method == 'GET':
        diaryList = session.query(Diary).filter_by(public=True)
        if diaryList.first():
            diaryList_serialized = [d.serialize for d in diaryList.all()]
            
            return jsonify({'status': True,'result':diaryList_serialized }),200#
        else:
            return jsonify({'status': True, 'result': []}),200#
    else:
        return get_secret_diary()


@app.route('/diary/create',methods=['POST'])
#@auth.login_required
def create_diary():
    if request.method == 'POST':
        curr_token = request.json.get('token')
        target= session.query(Token).filter_by(uuid=curr_token).first()

        if target and not target.expired:
            title = request.json.get('title')
            public = request.json.get('public')
            text = request.json.get('text')
            newDiary = Diary(title=title,author=target.username,publish_date=date.today(),public=public,text=text)
            session.add(newDiary)
            session.commit()
            return jsonify({'status': True}), 201#
        else:
            return jsonify({'status':False, 'error':'Invalid authentication token.'}), 200#

@app.route('/diary/delete',methods=['POST'])
#@auth.login_required
def delete_diary():
    if request.method=='POST':
        curr_token = request.json.get('token')
        target= session.query(Token).filter_by(uuid=curr_token).first()
        if target and not target.expired:
            curr_id = request.json.get('id')
            d = session.query(Diary).filter_by(id=curr_id).first()
            session.delete(d)
            session.commit()
            return jsonify({'status': True}), 200#
        else:
            return jsonify({'status':False, 'error':'Invalid authentication token.'}), 200#

@app.route('/diary/permission',methods=['POST'])
#@auth.login_required
def change_permission():
    if request.method=='POST':
        curr_token = request.json.get('token')
        target = session.query(Token).filter_by(uuid=curr_token).first()
        if target and not target.expired:
            public = request.json.get('public')
            id = request.json.get('id')
            d = session.query(Diary).filter_by(id=id).first()
            d.public=public
            session.add(d)
            session.commit()
            return jsonify({'status':True}), 200#
        else:
            return jsonify({'status':False, 'error':'Invalid authentication token.'}), 200#

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
    app.run(debug=True, port=8080, host="0.0.0.0")
