import requests

remote = "http://localhost:8080"
endpoint_list = ["/", "/meta/heartbeat", "/meta/members", "/users/register",
                 "/users/authenticate", "/users/expire", "/users", "/diary",
                 "/diary/create", "/diary/delete", "/diary/permission"]
token = None
diary_entry_id = None

# Get list of endpoints
# 11 points is granted if all the required endpoints are present
def endpoints():
    "'/' Endpoints Listing"
    endpoint = "/"
    res = 0
    target = "%s%s" % (remote, endpoint)
    req = requests.get(target)
    if req.status_code != 200:
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        return 0
    for i in endpoint_list:
        if i in json_result['result']:
            res += 1
    return res

# Heartbeat
# 1 point is granted if the status is true
def heartbeat():
    "'/meta/heartbeat' Status"
    endpoint = "/meta/heartbeat"
    target = "%s%s" % (remote, endpoint)
    req = requests.get(target)
    if req.status_code != 200:
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        return 0
    return 1

# Team Members
# 1 point is granted if a list is supplied in the member list
def members():
    "'/meta/members' Team Members Listing"
    endpoint = "/meta/members"
    target = "%s%s" % (remote, endpoint)
    req = requests.get(target)
    if req.status_code != 200:
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        return 0
    if type(json_result['result']) != list:
        return 0
    # print "Members: %s" % ", ".join(json_result['result'])
    return 1

# Register a New User
# 3 points for registering a new user
def register_new_user_valid():
    "'/users/register' Register a non-existent user"
    endpoint = "/users/register"
    target = "%s%s" % (remote, endpoint)
    params = {
            "username": "AzureDiamond",
            "password": "GoodHunter2@",
            "fullname": "Joey Pardella",
            "age": 15
            }
    req = requests.post(target, json=params)
    if req.status_code != 201:
        print "'/users/register': Status Code not 201"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/users/register': Status not true"
        return
    return 3

# Register an Existing User
# 2 points for failing to register an existing user
def register_new_user_invalid():
    "'/users/register' Register an existing user"
    endpoint = "/users/register"
    target = "%s%s" % (remote, endpoint)
    params = {
            "username": "AzureDiamond",
            "password": "GoodHunter2@",
            "fullname": "Joey Pardella",
            "age": 15
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/users/register': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/users/register': Status not False"
        return 0
    return 2

# Authenticate a Valid User
# 3 Points for Authenticating a Valid User
def authenticate_valid_user():
    "'/users/authenticate' Authenticate a valid user"
    endpoint = "/users/authenticate"
    target = "%s%s" % (remote, endpoint)
    params = {
            "username": "AzureDiamond",
            "password": "GoodHunter2@"
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/users/authenticate': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/users/authenticate': Status not True"
        return 0
    if 'result' not in json_result:
        if 'token' not in json_result:
            print "'/users/authenticate': Token not in result"
            return 0
    elif 'token' not in json_result['result']:
        print "'/users/authenticate': Token not in result"
        return 0
    global token
    if 'token' in json_result:
        token = json_result['token']
    else:
        token = json_result['result']['token']
    print "Token: %s" % token
    return 3

# Authenticate an invalid user
# 3 Points for not Authenticating an Invalid User
def authenticate_invalid_user():
    "'/users/authenticate' Authenticate an invalid user"
    endpoint = "/users/authenticate"
    target = "%s%s" % (remote, endpoint)
    params = {
            "username": "NotExisting",
            "password": "NotAPassword"
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/users/authenticate': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/users/authenticate': Status not False"
        return 0
    return 3

# Expire valid
# 3 Points for expiring a valid token
def expire_valid_user():
    "'/users/expire' Expire a valid token"
    endpoint = "/users/expire"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/users/expire': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/users/expire': Status not True"
        return 0
    return 3

# Expire invalid
# 3 Points for not expiring an invalid token
def expire_invalid_user():
    "'/users/expire' Expire a valid token"
    endpoint = "/users/expire"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": "6bf00d02-dffc-4849-a635-a21b08500d61",
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/users/expire': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/users/expire': Status not False"
        return 0
    return 3

# Retrieve valid
# 3 Points for retrieving a valid token
def retrieve_valid_user():
    "'/users' Retrieve valid user"
    endpoint = "/users"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/users': Status Code not 200"
        return 0
    json_result = req.json()
    #print "Retrieved user: %s" % json_result
    if json_result['status'] != True:
        print "'/users': Status not True"
        return 0
    return 3

# Retrieve invalid
# 3 Points for not retrieving an invalid token
def retrieve_invalid_user():
    "'/users' Retrieve invalid user"
    endpoint = "/users"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": "6bf00d02-dffc-4849-a635-a21b08500d61",
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/users': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/users': Status not False"
        return 0
    return 3

# Create public diary entry
# 3 Points for creating a public diary entry
def create_public_diary_entry():
    "'/diary/create' Create a public diary entry"
    endpoint = "/diary/create"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            "title": "Everyone Can See This Post",
            "public": True,
            "text": "It is not very secret!"
            }
    req = requests.post(target, json=params)
    if req.status_code != 201:
        print "'/diary/create': Status Code not 201"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/diary/create': Status not True"
        return 0
    # print "Public Diary Created: %s" % json_result
    global diary_entry_id
    diary_entry_id = json_result['result']['id']
    return 3

# Create private diary entry
# 3 Points for creating a private diary entry
def create_private_diary_entry():
    "'/diary/create' Create a private diary entry"
    endpoint = "/diary/create"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            "title": "No Can See This Post",
            "public": False,
            "text": "It is very secret!"
            }
    req = requests.post(target, json=params)
    if req.status_code != 201:
        print "'/diary/create': Status Code not 201"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/diary/create': Status not True"
        return 0
    # print "Private Diary Created: %s" % json_result
    return 3

# Create diary entry with invalid token
# 3 Points for not creating a public diary entry
def create_invalid_diary_entry():
    "'/diary/create' Create a invalid token diary entry"
    endpoint = "/diary/create"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": "6bf00d02-dffc-4849-a635-a21b08500d61",
            "title": "No Can See This Post",
            "public": False,
            "text": "It is very secret!"
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary/create': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/diary/create': Status not False"
        return 0
    return 3

# Retrieve all public diary entries
# 1 point for endpoint
# 3 Points for retrieving all public entries
def retrieve_public_entries():
    "'/diary' Retrieve all public entries"
    endpoint = "/diary"
    target = "%s%s" % (remote, endpoint)
    req = requests.get(target)
    if req.status_code != 200:
        print "'/diary': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/diary': Status not True"
        return 1
    # print "All entries: %s" % json_result
    for i in json_result['result']:
        if i['public'] == False:
            print "'/diary': Private entry found"
            return 1
    return 3

# Retrieve all diary entries
# 3 Points for retrieving all entries by token
def retrieve_private_entries():
    "'/diary' Retrieve all user's entries"
    endpoint = "/diary"
    target = "%s%s" % (remote, endpoint)
    params = {
             "token": token,
             }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/diary': Status not True"
        return 0
    # print "All user's entries: %s" % json_result
    flag = False
    for i in json_result['result']:
        if i['public'] == False:
            flag = True
    if flag:
        return 3
    else:
        print "'/diary': No private posts found."
        return 0

# Retrieve all diary entries with invalid token
# 3 Points for not retrieving all entries by invalid token
def retrieve_private_entries_invalid():
    "'/diary' Retrieve all user's entries with invalid token"
    endpoint = "/diary"
    target = "%s%s" % (remote, endpoint)
    params = {
             "token": "6bf00d02-dffc-4849-a635-a21b08500d61",
             }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/diary': Status not False"
        return 0
    return 3

# Adjust the status of a valid entry
# 3 Points for adjusting
def adjust_entries_valid():
    "'/diary/permission' Adjust the permission of valid entry"
    endpoint = "/diary/permission"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            "id": diary_entry_id,
            "public": False
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary/permission': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/diary/permission': Status not True"
        return 0
    return 3

# Adjust the status of an invalid entry
# 2 Points for not adjusting
def adjust_entries_invalid():
    "'/diary/permission' Adjust the permission of invalid entry"
    endpoint = "/diary/permission"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            "id": 31337,
            "public": False
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary/permission': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/diary/permission': Status not False"
        return 0
    return 2

# Adjust the status of a valid entry with invalid token
# 3 Points for not adjusting
def adjust_entries_invalid_token():
    "'/diary/permission' Adjust the permission of valid entry with invalid token"
    endpoint = "/diary/permission"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": "6bf00d02-dffc-4849-a635-a21b08500d61",
            "id": diary_entry_id,
            "public": False
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary/permission': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/diary/permission': Status not False"
        return 0
    return 3

# Delete a valid entry
# 3 Points for adjusting
def delete_entries_valid():
    "'/diary/delete' Delete a valid entry"
    endpoint = "/diary/delete"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            "id": diary_entry_id,
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary/delete': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != True:
        print "'/diary/delete': Status not True"
        return 0
    return 3

# Delete an invalid entry
# 2 Points for not deleting
def delete_entries_invalid():
    "'/diary/delete' Delete an invalid entry"
    endpoint = "/diary/delete"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": token,
            "id": 31337,
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary/delete': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/diary/delete': Status not False"
        return 0
    return 2

# Delete a valid entry with invalid token
# 3 Points for not adjusting
def delete_entries_invalid_token():
    "'/diary/delete' Delete a valid entry with invalid token"
    endpoint = "/diary/delete"
    target = "%s%s" % (remote, endpoint)
    params = {
            "token": "6bf00d02-dffc-4849-a635-a21b08500d61",
            "id": diary_entry_id,
            }
    req = requests.post(target, json=params)
    if req.status_code != 200:
        print "'/diary/delete': Status Code not 200"
        return 0
    json_result = req.json()
    if json_result['status'] != False:
        print "'/diary/delete': Status not False"
        return 0
    return 3

def grade(func, max_points):
    try:
        result = func()
    except:
        print "Exception in connection."
        result = 0
    print "%s: %d/%d" % (func.__doc__, result, max_points)
    return (result, max_points)

def aug_grade(current, func, max_points):
    results, total = current
    returned = grade(func, max_points)
    assert returned[0] <= returned[1]
    results += returned[0]
    total += returned[1]
    return (results, total)

def main():
    results = 0
    total = 0

    results, total = aug_grade((results, total), endpoints, 11)
    results, total = aug_grade((results, total), heartbeat, 1)
    results, total = aug_grade((results, total), members, 1)
    results, total = aug_grade((results, total), register_new_user_valid, 3)
    results, total = aug_grade((results, total), register_new_user_invalid, 2)
    results, total = aug_grade((results, total), authenticate_valid_user, 3)
    results, total = aug_grade((results, total), authenticate_invalid_user, 3)
    results, total = aug_grade((results, total), retrieve_valid_user, 3)
    results, total = aug_grade((results, total), retrieve_invalid_user, 3)
    results, total = aug_grade((results, total), create_public_diary_entry, 3)
    results, total = aug_grade((results, total), create_private_diary_entry, 3)
    results, total = aug_grade((results, total), create_invalid_diary_entry, 3)
    results, total = aug_grade((results, total), retrieve_public_entries, 3)
    results, total = aug_grade((results, total), retrieve_private_entries, 3)
    results, total = aug_grade((results, total),
            retrieve_private_entries_invalid, 3)
    results, total = aug_grade((results, total), adjust_entries_valid, 3)
    results, total = aug_grade((results, total), adjust_entries_invalid, 2)
    results, total = aug_grade((results, total), adjust_entries_invalid_token, 3)
    results, total = aug_grade((results, total), delete_entries_valid, 3)
    results, total = aug_grade((results, total), delete_entries_invalid, 2)
    results, total = aug_grade((results, total), delete_entries_invalid_token, 3)

    results, total = aug_grade((results, total), expire_valid_user, 3)
    results, total = aug_grade((results, total), authenticate_invalid_user, 3)

    print "Results: %d/%d" % (results, total)

if __name__ == "__main__":
    main()
