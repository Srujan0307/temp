#!/bin/bash

# Set the database connection details
DB_USER="your_username"
DB_HOST="your_host"
DB_PORT="your_port"
DB_NAME="your_database"

# Set the backup file to restore
BACKUP_FILE="/path/to/backup/file.sql"

# Run the restore command
psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" < "$BACKUP_FILE"

# Check if the restore was successful
if [ $? -eq 0 ]; then
  echo "Restore successful"
else
  "Restore failed"
fi
