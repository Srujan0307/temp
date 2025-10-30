
# Database Schema Documentation

## ER Diagram

```mermaid
erDiagram
    tenants {
        int id PK
        string name
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    users {
        int id PK
        string first_name
        string last_name
        string email
        string password
        int tenant_id FK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    tenant_settings {
        int id PK
        int tenant_id FK
        jsonb settings
        datetime created_at
        datetime updated_at
    }

    roles {
        int id PK
        string name
        text description
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    permissions {
        int id PK
        string name
        text description
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    user_roles {
        int id PK
        int user_id FK
        int role_id FK
        datetime created_at
        datetime updated_at
    }

    role_permissions {
        int id PK
        int role_id FK
        int permission_id FK
        datetime created_at
        datetime updated_at
    }

    audit_events {
        int id PK
        int user_id FK
        string event_name
        jsonb payload
        datetime created_at
        datetime updated_at
    }

    clients {
        int id PK
        int tenant_id FK
        string name
        string email
        string phone
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    vehicles {
        int id PK
        int tenant_id FK
        int client_id FK
        int category_id FK
        string make
        string model
        int year
        string vin
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    vehicle_categories {
        int id PK
        string name
    }

    filings {
        int id PK
        int tenant_id FK
        int client_id FK
        int vehicle_id FK
        int status_id FK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    filing_statuses {
        int id PK
        string name
    }

    filing_docs {
        int id PK
        int tenant_id FK
        int filing_id FK
        string document_name
        string document_url
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    user_assignments {
        int id PK
        int tenant_id FK
        int user_id FK
        int filing_id FK
        datetime created_at
        datetime updated_at
    }

    notifications {
        int id PK
        int tenant_id FK
        int user_id FK
        int channel_id FK
        jsonb payload
        datetime read_at
        datetime created_at
        datetime updated_at
    }

    notification_channels {
        int id PK
        string name
    }

    calendar_events {
        int id PK
        int tenant_id FK
        int user_id FK
        string title
        text description
        datetime start_time
        datetime end_time
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    document_requests {
        int id PK
        int tenant_id FK
        int filing_id FK
        int client_id FK
        int status_id FK
        text request_details
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    document_request_statuses {
        int id PK
        string name
    }

    tenants ||--o{ users : "has many"
    tenants ||--o{ tenant_settings : "has one"
    tenants ||--o{ clients : "has many"
    tenants ||--o{ vehicles : "has many"
    tenants ||--o{ filings : "has many"
    tenants ||--o{ filing_docs : "has many"
    tenants ||--o{ user_assignments : "has many"
    tenants ||--o{ notifications : "has many"
    tenants ||--o{ calendar_events : "has many"
    tenants ||--o{ document_requests : "has many"

    users ||--|{ user_roles : "has many"
    roles ||--|{ user_roles : "has many"
    roles ||--|{ role_permissions : "has many"
    permissions ||--|{ role_permissions : "has many"
    users ||--o{ audit_events : "has many"
    users ||--o{ notifications : "has many"
    users ||--o{ calendar_events : "has many"
    users ||--|{ user_assignments : "has many"

    clients ||--o{ vehicles : "has many"
    clients ||--o{ filings : "has many"
    clients ||--o{ document_requests : "has many"
    
    vehicles ||--o{ filings : "has many"
    vehicle_categories ||--o{ vehicles : "has many"

    filings ||--o{ filing_docs : "has many"
    filings ||--|{ user_assignments : "has many"
    filings ||--o{ document_requests : "has many"
    filing_statuses ||--o{ filings : "has many"
    
    notification_channels ||--o{ notifications : "has many"
    document_request_statuses ||--o{ document_requests : "has many"
```

## Relational Notes

### Tenancy
- The `tenants` table is the root of the tenancy model.
- Most tables have a `tenant_id` column to scope data to a specific tenant.
- `users`, `clients`, `vehicles`, `filings`, etc. are all scoped to a tenant.

### Users and Permissions
- Users are associated with a tenant.
- `roles` and `permissions` are defined globally.
- `user_roles` is a join table for the many-to-many relationship between users and roles.
- `role_permissions` is a join table for the many-to-many relationship between roles and permissions.

### Filings and Documents
- `filings` are associated with a `client` and a `vehicle`.
- `filing_docs` stores documents related to a specific filing.
- `user_assignments` links users to filings, indicating responsibility.
- `document_requests` are initiated for a `filing` and a `client`.

### Enums and Statuses
- `vehicle_categories`, `filing_statuses`, `notification_channels`, and `document_request_statuses` are enum tables to enforce constraints and provide a single source of truth for these values.

### Soft Deletes
- Most tables have a `deleted_at` column to enable soft deletes. This allows for data to be recovered if accidentally deleted.

### Auditing
- `audit_events` logs user actions for security and compliance purposes. It is linked to the `users` table.

### Indexes and Constraints
- Foreign key constraints are used to maintain relational integrity.
- Unique constraints are used on columns like `email` in the `users` and `clients` tables (scoped to `tenant_id`), and `name` in the enum tables.
- Indexes are created on foreign key columns and other frequently queried columns to improve performance.
- GIN indexes are recommended for `jsonb` columns like `settings` in `tenant_settings` and `payload` in `audit_events` and `notifications`. I have not added them in the migrations as they are not supported by all versions of postgresql, but they should be considered for performance.
