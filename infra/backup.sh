#!/bin/bash

# Set the database connection details
DB_USER="your_username"
DB_HOST="your_host"
DB_PORT="your_port"
DB_NAME="your_database"

# Set the backup directory
BACKUP_DIR="/path/to/backup/directory"

# Create the backup file name
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y-%m-%d_%H-%M-%S).sql"

# Run the backup command
pg_dump -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" > "$BACKUP_FILE"

# Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
else
  echo "Backup failed"
fi
