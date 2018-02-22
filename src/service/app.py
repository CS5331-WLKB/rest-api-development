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
engine = create_engine('sqlite"///secretDiary,db')
Base.metadata.bind=engine
DBSession = sessionmaker(bind=enigne)
session = DBSession()

# clear up token table at every start
session.query(token).delete()
session.commit()

app = Flask(__name__)
# Enable cross origin sharing for all endpoints
CORS(app)

# Remember to update this list
ENDPOINT_LIST = ['/', '/meta/heartbeat', '/meta/members']


@auth.verify_password
def verify_password(username,password):
    user = session.query(User).filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return Fasle
    g.user=user
    return True

@app.route("/users/register",['POST'])
def user_registration():
    if request.method == 'POST':
        username=request.json.get('username')
        password=request.json.get('password')
        fullname=request.json.get('fullname')
        age=request.json.get('age')

        if username is None or password is None or fullname is None:
            print 'missing required field'
            abort(400)

        if session.query(User).filter_by(username=username).first() is not None:
            err = 'user already exist'
            return jsonify({'status':False,'error':'User already exists!'}),200#
        user = User(username=username, fullname=fullname,age=age)
        user.hash_password(password)
        session.add(user)
        session.commit()

        return jsonify({'status':True}),201#

@auth.login_required
def get_token():
    temp_uuid = str(uuid.uuid4())
    newToken = Token(uuid=temp_uuid,expired=False)
    session.add(newToken)
    session.commit()
    return jsonify({'status':True, 'token':temp_uuid}), 200#
    
@app.route('/users/authenticate',['POST'])
def get_authentication():
    if request.method=='POST':
        username = request.json.get('username')
        password = request.json.get('password')
        if verify_password(username,password):
            get_token()
        else:
            return jsonify({'status': False}), 200#

@app.route('/users/expire',['POST'])
def expire_token():
    if request.method=='POST':
        try:
            temp_uuid = request.json.get('token')
            target = session.query(token).filter_by(uuid=temp_uuid).first()
            target.expired=True
            session.add(target)
            session.commit()
            return jsonify({'status':True}),200#
        except:
            return jsonify({'status':False}),200#

@app.route('/users',['POST'])
@auth.login_required
def get_user():
    if request.method='POST':
        curr_uuid = request.json.get('token')
        target = session.query(Token).filter_by(uuid = curr_uuid).first()
        if target.expired:
            return jsonify({'status': False,'Invalid authentication token.'}),200#
        else:
            username = g.user.username
            curr_user = session.query(User).filter_by(username=username).first()
            return jsonify({'status':True, 'username':username, 'fullname': curr_user.fullname, 'age': curr_user.age}),200#


@auth.login_required
def get_secret_diary():
    curr_token = request.json.get('token')
    target = session.query(Token).filter_by(uuid=curr_token).first()
    if not target.expire:
        diaryList = session.query(Diary).filter_by(username=g.user.username)
        if len(diaryList):
            diaryList_serialized = [d.serialize() for d in diaryList]
            return jsonify({'status': True, 'result':diaryList_serialized}), 201#
        else:
            return jsonify({'status': True, 'result':[]}), 201#
    return jsonify({'status': False, 'error': 'Invalid authentication token.'}), 200#
    
        
@app.route('/diary', method=['GET','POST'])
def get_diary():
    if request.method == 'GET':
        diaryList = session.query(Diary).filter_by(public=True)
        if len(diaryList):
            diaryList_serialized = [d.serialize() for d in diaryList]
            return jsonify({'status': True,'result':diaryList_serialized }),201#
        else:
            return jsonify({'status': True, 'result': []}),201#
    else:
        get_secret_diary()


@app.route('/diary/create',['POST'])
@auth.login_required
def create_diary():
    if request.method == 'POST':
        curr_token = request.json.get('token')
        target= session.query(Token).filter_by(uuid=curr_token).first()

        if not target.expire:
            title = request.json.get('title')
            public = request.json.get('public')
            text = request.json.get('text')
            newDiary = Diary(title=title,public=public,text=text,author=g.user.username,publish_date=date.today().isoformat())
            session.add(newDiary)
            session.commit()
            return jsonify({'status': True}), 201#
        else:
            return jsonify({'status':False, 'error':'Invalid authentication token.'}), 200#

@app.route('/diary/delete',['POST'])
@auth.login_required
def delete_diary():
    if request.mthod='POST':
        curr_token = request.json.get('token')
        target= session.query(Token).filter_by(uuid=curr_token).first()
        if not target.expire:
            curr_id = request.json.get('id')
            d = session.query(Diary).filter_by(id=id).first()
            session.delete(d)
            session.commit()
            return jsonify({'status': True}), 200#
        else:
            return jsonify({'status':False, 'error':'Invalid authentication token.'}), 200#

@app.route('/diary/permission',['POST'])
@auth.login_required
def change_permission():
    if request.method='POST':
        curr_token = request.json.get('token')
        target = session.query(Token).filter_by(uuid=curr_token).first()
        if not target.expire:
            public = request.json.get('public')
            id = request.json.get('id')
            d = session.query(Diary).filter_by(id=id).first()
            d.permission=public
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
