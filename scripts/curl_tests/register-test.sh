#!/bin/bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
        "email": "teacher.test@ugent.be",
        "firstName": "teacher",
        "familyName": "test",
        "password": "azertyuiop",
        "schoolName": "UGent",
        "userType": "teacher"
     }'\
    http://localhost:3001/register
