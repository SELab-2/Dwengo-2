#!/bin/bash

# Timestamp voor unieke bestandsnamen
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

# Maak een PostgreSQL backup en sla deze extern op
docker exec prod-database-1 pg_dump -U postgres -F c -b -v -f /tmp/backup.sql dwengo-database
docker cp prod-database-1:/tmp/backup.sql $BACKUP_FILE

# Oude backups opruimen (max 7 backups)
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -exec rm {} \;

echo "Backup opgeslagen: $BACKUP_FILE"