#!/usr/bin/env python3
import requests
import json
import argparse

# Base URL
BASE_URL = "http://localhost:3001"

# **************** Register & Login *****************

def register_teacher():
    """Step 1: Register a teacher"""
    register_payload = {
        "email": "adrienvanlancker@gmail.com",
        "firstName": "Adrien",
        "familyName": "Van Lancker",
        "password": "everything_everywhere_all_at_once",
        "schoolName": "ugent"
    }

    register_url = f"{BASE_URL}/register?userType=teacher"
    response = requests.post(register_url, json=register_payload, headers={"Content-Type": "application/json"})

    if response.status_code in (200, 201):
        user_id = response.json().get("id")
        print(f"Registration successful. User ID: {user_id}")
        return user_id
    else:
        print(f"Registration failed: {response.status_code} - {response.text}")
        exit(1)

def login_teacher():
    """Step 2: Log in with the registered credentials"""
    login_payload = {
        "email": "adrienvanlancker@gmail.com",
        "password": "everything_everywhere_all_at_once"
    }

    login_url = f"{BASE_URL}/login"
    response = requests.post(login_url, json=login_payload, headers={"Content-Type": "application/json"})

    if response.status_code == 200:
        token = response.json().get("token")
        user_id = response.json().get("id")
        print(f"Login successful. Token: {token}, User ID: {user_id}")
        return token, user_id
    else:
        print(f"Login failed: {response.status_code} - {response.text}")
        exit(1)

# **************** User Endpoints *****************

def get_user(user_id, token):
    """Step 3: GET user data"""
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    get_user_url = f"{BASE_URL}/users/{user_id}?userType=teacher"
    response = requests.get(get_user_url, headers=headers)

    if response.status_code == 200:
        print(f"User data retrieved: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Get user failed: {response.status_code} - {response.text}")

# **************** Class Endpoints *****************

def create_class(user_id, token):
    """Step 4: Create a class"""
    class_payload = {
        "name": "A Course on Cliodynamics, Psyops and the Virus That Is Language",
        "description": "A cross-discipline analysis on how humanity's societary history and its evolutionary branches along with a deep dive on how hierarchically enforced echo-chambers alter individuals' cognitive perceptive states of both extrinsic and intrinsic experiences.",
        "targetAudience": "Critical thinkers, philosophers and anyone with an open mind and a desire to understand the messy and paradoxical bigger picture of humanity.",
        "teacherId": user_id
    }
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    create_class_url = f"{BASE_URL}/classes"
    response = requests.post(create_class_url, json=class_payload, headers=headers)

    if response.status_code in (200, 201):
        class_id = response.json().get("id")  # Assuming the response includes a class ID
        print(f"Class created successfully: {json.dumps(response.json(), indent=2)}")
        return class_id
    else:
        print(f"Class creation failed: {response.status_code} - {response.text}")
        return None

def get_user_classes(user_id, token):
    """Step 5: GET classes for a user"""
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    get_classes_url = f"{BASE_URL}/users/{user_id}/classes"
    response = requests.get(get_classes_url, headers=headers)

    if response.status_code == 200:
        print(f"User classes retrieved: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Get user classes failed: {response.status_code} - {response.text}")

def get_class(class_id, token):
    """Step 6: GET class data"""
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    get_class_url = f"{BASE_URL}/classes/{class_id}"  # No query params, assuming ID-based lookup
    response = requests.get(get_class_url, headers=headers)

    if response.status_code == 200:
        print(f"Class data retrieved: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Get class failed: {response.status_code} - {response.text}")

def delete_class(class_id, token):
    """Step 7: DELETE a class"""
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    delete_class_url = f"{BASE_URL}/classes/{class_id}"
    response = requests.delete(delete_class_url, headers=headers)

    if response.status_code in (200, 204):  # 204 No Content is common for DELETE success
        print(f"Class {class_id} deleted successfully.")
    else:
        print(f"Delete class failed: {response.status_code} - {response.text}")

# **************** Main Code *****************

def main():
    # Set up argument parser for optional execution
    parser = argparse.ArgumentParser(description="Automate API calls for registration, login, and class management.")
    parser.add_argument("--register", action="store_true", help="Execute teacher registration")
    parser.add_argument("--login", action="store_true", help="Execute login")
    parser.add_argument("--get-user", action="store_true", help="Execute get user data")
    parser.add_argument("--create-class", action="store_true", help="Execute class creation")
    parser.add_argument("--get-user-classes", action="store_true", help="Execute get classes for user")
    parser.add_argument("--get-class", action="store_true", help="Execute get class data")
    parser.add_argument("--delete-class", action="store_true", help="Execute class deletion")
    args = parser.parse_args()

    # Variables to store state
    user_id = None
    token = None
    class_id = None

    # Execute steps based on arguments
    if args.register:
        user_id = register_teacher()

    if args.login or not user_id:  # Login if explicitly requested or if no user_id from register
        token, user_id = login_teacher()

    if not token or not user_id:
        print("Error: Token or User ID missing. Cannot proceed with authenticated requests.")
        exit(1)

    if args.get_user:
        get_user(user_id, token)

    if args.create_class:
        class_id = create_class(user_id, token)

    if args.get_user_classes:
        get_user_classes(user_id, token)

    if args.get_class:
        if class_id:
            get_class(class_id, token)
        else:
            print("Error: No class ID available. Run --create-class first or provide a class ID manually.")

    if args.delete_class:
        if class_id:
            delete_class(class_id, token)
        else:
            print("Error: No class ID available. Run --create-class first or provide a class ID manually.")

if __name__ == "__main__":
    main()
