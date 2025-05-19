#!/bin/bash

# Serve frontend for e2e tests (does file replacements)
docker exec dwengo-2-frontend-1 curl -s http://localhost:4202 > /dev/null
if [ $? -ne 0 ]; then
        docker exec dwengo-2-frontend-1 ng serve --configuration=e2e --port=4202 &

        # Wait until serving is done
        for i in {1..30}; do
                docker exec dwengo-2-frontend-1 curl -s http://localhost:4202 > /dev/null

                if [ $? -eq 0 ]; then
                        break;
                fi
                sleep 2;
        done
fi

# Clear db
docker exec dwengo-2-backend-1 npm run db:clear

# Run chrome test
docker exec dwengo-2-frontend-1 npm run e2e:chrome

# Clear db
docker exec dwengo-2-backend-1 npm run db:clear

# Rune firefox test
# docker exec dwengo-2-frontend-1 npm run e2e:firefox

# Clear db
# docker exec dwengo-2-backend-1 npm run db:clear
