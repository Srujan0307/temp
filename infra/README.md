# Backup and Restore

This document provides instructions on how to back up and restore the database and MinIO storage.

## Ansible Playbook

The `playbook.md` file contains the Ansible playbook for backing up and restoring the database and MinIO storage.

To run the playbook, use the following command:

```bash
ansible-playbook playbook.md
```

## Manual Backup and Restore

If you prefer to perform the backup and restore manually, follow the instructions in the `playbook.md` file.

### Prerequisites

- Ansible installed on your local machine.
- Access to the database and MinIO storage.

### Configuration

Before running the playbook, make sure to update the following variables in the `playbook.md` file:

- `pg_user`: The PostgreSQL username.
- `pg_host`: The PostgreSQL host.
- `pg_port`: The PostgreSQL port.
- `pg_database`: The PostgreSQL database name.
- `minio_source`: The MinIO source.
- `minio_destination`: The MinIO backup destination.
