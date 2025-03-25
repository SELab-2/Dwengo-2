#!/bin/bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
        "email": "bram.comyn@ugent.be",
        "firstName": "Bram",
        "familyName": "Comyn",
        "password": "out_beyond_ideas",
        "schoolName": "UGent",
        "userType": "teacher"
     }'\
    http://localhost:3001/register
