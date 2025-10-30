import { Knex } from 'knex';
import bcrypt from 'bcrypt';

type TenantRecord = {
  id: number;
  name: string;
};

type UserFixture = {
  tenantName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
};

type ClientFixture = {
  tenantName: string;
  name: string;
  email: string;
  phone: string;
};

type VehicleFixture = {
  tenantName: string;
  clientEmail: string;
  category: string;
  make: string;
  model: string;
  year: number;
  vin: string;
};

type FilingFixture = {
  tenantName: string;
  clientEmail: string;
  vehicleVin: string;
  status: string;
};

const tablesToTruncate = [
  'audit_events',
  'notifications',
  'calendar_events',
  'filing_docs',
  'document_requests',
  'document_request_statuses',
  'user_assignments',
  'role_permissions',
  'user_roles',
  'filings',
  'filing_statuses',
  'vehicles',
  'vehicle_categories',
  'clients',
  'users',
  'permissions',
  'roles',
  'tenant_settings',
  'notification_channels',
  'user_invites',
  'refresh_tokens',
  'tenants',
];

async function resetDatabase(knex: Knex): Promise<void> {
  const tables = tablesToTruncate.map((table) => `"${table}"`).join(', ');
  await knex.raw(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`);
}

export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Development fixtures can only be seeded when NODE_ENV=\'development\'.');
  }

  await resetDatabase(knex);

  const tenantFixtures: Pick<TenantRecord, 'name'>[] = [
    { name: 'Acme Logistics' },
    { name: 'Beta Transport' },
  ];

  const tenants = await knex<TenantRecord>('tenants')
    .insert(tenantFixtures)
    .returning(['id', 'name']);

  const tenantsByName = new Map<string, TenantRecord>(tenants.map((tenant) => [tenant.name, tenant]));

  await knex('tenant_settings').insert(
    tenants.map((tenant) => ({
      tenant_id: tenant.id,
      settings: {
        timezone: tenant.name === 'Acme Logistics' ? 'America/New_York' : 'America/Chicago',
        autoAssign: tenant.name === 'Acme Logistics',
        documentBucket: 'dev-filings',
      },
    })),
  );

  const roles = await knex('roles')
    .insert([
      { name: 'admin', description: 'Full platform access for configuration and tenant management.' },
      { name: 'manager', description: 'Manages client filings and assignments.' },
      { name: 'specialist', description: 'Prepares filings and responds to document requests.' },
      { name: 'auditor', description: 'Reviews audit logs and verifies compliance.' },
    ])
    .returning(['id', 'name']);

  const permissions = await knex('permissions')
    .insert([
      { name: 'manage:users', description: 'Create, update, and archive user accounts.' },
      { name: 'manage:filings', description: 'Create and update client filings.' },
      { name: 'view:reports', description: 'Access tenant reports and analytics.' },
      { name: 'review:audit', description: 'Review and comment on audit events.' },
    ])
    .returning(['id', 'name']);

  const rolePermissionMatrix: Record<string, string[]> = {
    admin: ['manage:users', 'manage:filings', 'view:reports', 'review:audit'],
    manager: ['manage:filings', 'view:reports'],
    specialist: ['manage:filings'],
    auditor: ['view:reports', 'review:audit'],
  };

  const permissionIdByName = new Map(permissions.map((permission) => [permission.name, permission.id]));
  const roleIdByName = new Map(roles.map((role) => [role.name, role.id]));

  const rolePermissionRows = Object.entries(rolePermissionMatrix).flatMap(([roleName, permissionNames]) => {
    const roleId = roleIdByName.get(roleName);
    if (!roleId) {
      return [];
    }

    return permissionNames
      .map((permissionName) => ({
        role_id: roleId,
        permission_id: permissionIdByName.get(permissionName),
      }))
      .filter((row) => row.permission_id);
  });

  if (rolePermissionRows.length > 0) {
    await knex('role_permissions').insert(rolePermissionRows);
  }

  const userFixtures: UserFixture[] = [
    {
      tenantName: 'Acme Logistics',
      firstName: 'Alice',
      lastName: 'Admin',
      email: 'alice.admin@acme.test',
      password: 'Password123!',
      roles: ['admin'],
    },
    {
      tenantName: 'Acme Logistics',
      firstName: 'Mark',
      lastName: 'Manager',
      email: 'mark.manager@acme.test',
      password: 'Password123!',
      roles: ['manager'],
    },
    {
      tenantName: 'Acme Logistics',
      firstName: 'Sophie',
      lastName: 'Specialist',
      email: 'sophie.specialist@acme.test',
      password: 'Password123!',
      roles: ['specialist'],
    },
    {
      tenantName: 'Beta Transport',
      firstName: 'Brian',
      lastName: 'Boss',
      email: 'brian.boss@beta.test',
      password: 'Password123!',
      roles: ['admin'],
    },
    {
      tenantName: 'Beta Transport',
      firstName: 'Kelly',
      lastName: 'Coordinator',
      email: 'kelly.coordinator@beta.test',
      password: 'Password123!',
      roles: ['manager'],
    },
    {
      tenantName: 'Beta Transport',
      firstName: 'Oscar',
      lastName: 'Operator',
      email: 'oscar.operator@beta.test',
      password: 'Password123!',
      roles: ['specialist'],
    },
    {
      tenantName: 'Beta Transport',
      firstName: 'Abby',
      lastName: 'Auditor',
      email: 'abby.auditor@beta.test',
      password: 'Password123!',
      roles: ['auditor'],
    },
  ];

  const tenantIdOrThrow = (tenantName: string): number => {
    const tenant = tenantsByName.get(tenantName);
    if (!tenant) {
      throw new Error(`Missing tenant fixture for ${tenantName}`);
    }

    return tenant.id;
  };

  const userRows = await Promise.all(
    userFixtures.map(async (user) => ({
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
      tenant_id: tenantIdOrThrow(user.tenantName),
    })),
  );

  const insertedUsers = await knex('users').insert(userRows).returning(['id', 'email', 'tenant_id']);
  const usersByEmail = new Map<string, { id: number; tenantId: number; roles: string[] }>();

  insertedUsers.forEach((record, index) => {
    usersByEmail.set(record.email, {
      id: record.id,
      tenantId: record.tenant_id,
      roles: userFixtures[index]?.roles ?? [],
    });
  });

  const hasRoleColumn = await knex.schema.hasColumn('user_roles', 'role');

  const userRoleRows = userFixtures.flatMap((fixture) => {
    const user = usersByEmail.get(fixture.email);
    if (!user) {
      return [];
    }

    if (hasRoleColumn) {
      return fixture.roles.map((role) => ({
        user_id: user.id,
        role,
      }));
    }

    return fixture.roles
      .map((role) => ({
        user_id: user.id,
        role_id: roleIdByName.get(role),
      }))
      .filter((row) => row.role_id);
  });

  if (userRoleRows.length > 0) {
    await knex('user_roles').insert(userRoleRows);
  }

  const clientFixtures: ClientFixture[] = [
    {
      tenantName: 'Acme Logistics',
      name: 'Evergreen Manufacturing',
      email: 'operations@evergreen.test',
      phone: '555-1001',
    },
    {
      tenantName: 'Acme Logistics',
      name: 'Northern Supplies',
      email: 'logistics@northern.test',
      phone: '555-1002',
    },
    {
      tenantName: 'Beta Transport',
      name: 'Sunrise Retail Group',
      email: 'fleet@sunrise.test',
      phone: '555-2001',
    },
    {
      tenantName: 'Beta Transport',
      name: 'Harbor Foods Co.',
      email: 'compliance@harbor.test',
      phone: '555-2002',
    },
  ];

  const clientRows = clientFixtures.map((client) => ({
    tenant_id: tenantIdOrThrow(client.tenantName),
    name: client.name,
    email: client.email,
    phone: client.phone,
  }));

  const insertedClients = await knex('clients').insert(clientRows).returning(['id', 'email', 'tenant_id']);

  const clientsByKey = new Map<string, { id: number; tenantId: number }>();
  insertedClients.forEach((client) => {
    clientsByKey.set(`${client.email}:${client.tenant_id}`, {
      id: client.id,
      tenantId: client.tenant_id,
    });
  });

  const vehicleCategories = await knex('vehicle_categories')
    .insert([{ name: 'Tractor' }, { name: 'Trailer' }, { name: 'Service Vehicle' }])
    .returning(['id', 'name']);

  const categoryIdByName = new Map(vehicleCategories.map((category) => [category.name, category.id]));

  const vehicleFixtures: VehicleFixture[] = [
    {
      tenantName: 'Acme Logistics',
      clientEmail: 'operations@evergreen.test',
      category: 'Tractor',
      make: 'Volvo',
      model: 'VNL 760',
      year: 2022,
      vin: '1M8GDM9AXKP042788',
    },
    {
      tenantName: 'Acme Logistics',
      clientEmail: 'logistics@northern.test',
      category: 'Trailer',
      make: 'Great Dane',
      model: 'Champion SE',
      year: 2021,
      vin: '1G1JC5244R7252367',
    },
    {
      tenantName: 'Beta Transport',
      clientEmail: 'fleet@sunrise.test',
      category: 'Service Vehicle',
      make: 'Ford',
      model: 'Transit',
      year: 2023,
      vin: '2FTZF17203CA12345',
    },
    {
      tenantName: 'Beta Transport',
      clientEmail: 'compliance@harbor.test',
      category: 'Tractor',
      make: 'Freightliner',
      model: 'Cascadia',
      year: 2020,
      vin: '3D7KS28C25G775311',
    },
  ];

  const vehicleRows = vehicleFixtures.map((vehicle) => {
    const tenantId = tenantIdOrThrow(vehicle.tenantName);
    const clientKey = `${vehicle.clientEmail}:${tenantId}`;
    const client = clientsByKey.get(clientKey);

    if (!client) {
      throw new Error(`Missing client fixture for ${vehicle.clientEmail}`);
    }

    const categoryId = categoryIdByName.get(vehicle.category);

    return {
      tenant_id: tenantId,
      client_id: client.id,
      category_id: categoryId,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin,
    };
  });

  const insertedVehicles = await knex('vehicles')
    .insert(vehicleRows)
    .returning(['id', 'tenant_id', 'client_id', 'vin']);

  const vehiclesByVin = new Map(insertedVehicles.map((vehicle) => [vehicle.vin, vehicle]));

  const filingStatuses = await knex('filing_statuses')
    .insert([
      { name: 'Draft' },
      { name: 'Awaiting Documents' },
      { name: 'Submitted' },
      { name: 'Approved' },
    ])
    .returning(['id', 'name']);

  const filingStatusIdByName = new Map(filingStatuses.map((status) => [status.name, status.id]));

  const filingFixtures: FilingFixture[] = [
    {
      tenantName: 'Acme Logistics',
      clientEmail: 'operations@evergreen.test',
      vehicleVin: '1M8GDM9AXKP042788',
      status: 'Awaiting Documents',
    },
    {
      tenantName: 'Acme Logistics',
      clientEmail: 'logistics@northern.test',
      vehicleVin: '1G1JC5244R7252367',
      status: 'Submitted',
    },
    {
      tenantName: 'Beta Transport',
      clientEmail: 'fleet@sunrise.test',
      vehicleVin: '2FTZF17203CA12345',
      status: 'Draft',
    },
    {
      tenantName: 'Beta Transport',
      clientEmail: 'compliance@harbor.test',
      vehicleVin: '3D7KS28C25G775311',
      status: 'Approved',
    },
  ];

  const filingRows = filingFixtures.map((filing) => {
    const tenantId = tenantIdOrThrow(filing.tenantName);
    const clientKey = `${filing.clientEmail}:${tenantId}`;
    const client = clientsByKey.get(clientKey);
    const vehicle = vehiclesByVin.get(filing.vehicleVin);

    if (!client || !vehicle) {
      throw new Error(`Missing client or vehicle fixture for filing ${filing.status}`);
    }

    return {
      tenant_id: tenantId,
      client_id: client.id,
      vehicle_id: vehicle.id,
      status_id: filingStatusIdByName.get(filing.status),
    };
  });

  const insertedFilings = await knex('filings')
    .insert(filingRows)
    .returning(['id', 'tenant_id', 'client_id', 'vehicle_id']);

  const documentRequestStatuses = await knex('document_request_statuses')
    .insert([{ name: 'Pending' }, { name: 'Received' }, { name: 'Overdue' }])
    .returning(['id', 'name']);

  const documentRequestStatusIdByName = new Map(
    documentRequestStatuses.map((status) => [status.name, status.id]),
  );

  const filingDocsRows = insertedFilings.map((filing, index) => ({
    tenant_id: filing.tenant_id,
    filing_id: filing.id,
    document_name: index % 2 === 0 ? 'Registration Certificate.pdf' : 'Safety Inspection.pdf',
    document_url: `minio://dev-filings/tenant-${filing.tenant_id}/filing-${filing.id}/document-${index + 1}.pdf`,
  }));

  await knex('filing_docs').insert(filingDocsRows);

  const documentRequestRows = insertedFilings.map((filing, index) => ({
    tenant_id: filing.tenant_id,
    filing_id: filing.id,
    client_id: filing.client_id,
    status_id:
      documentRequestStatusIdByName.get(index % 3 === 0 ? 'Pending' : index % 3 === 1 ? 'Received' : 'Overdue') ?? null,
    request_details:
      index % 2 === 0
        ? 'Please provide the latest insurance certificate for this vehicle.'
        : 'Upload the signed compliance affidavit to finalize the filing.',
  }));

  const insertedDocumentRequests = await knex('document_requests')
    .insert(documentRequestRows)
    .returning(['id', 'tenant_id', 'filing_id']);

  const userAssignmentsRows = insertedFilings.flatMap((filing, index) => {
    const fixture = filingFixtures[index];
    const user = usersByEmail.get(
      fixture.tenantName === 'Acme Logistics'
        ? index % 2 === 0
          ? 'sophie.specialist@acme.test'
          : 'mark.manager@acme.test'
        : index % 2 === 0
          ? 'oscar.operator@beta.test'
          : 'kelly.coordinator@beta.test',
    );

    if (!user) {
      return [];
    }

    return [
      {
        tenant_id: filing.tenant_id,
        user_id: user.id,
        filing_id: filing.id,
      },
    ];
  });

  if (userAssignmentsRows.length > 0) {
    await knex('user_assignments').insert(userAssignmentsRows);
  }

  const notificationChannels = await knex('notification_channels')
    .insert([{ name: 'in_app' }, { name: 'email' }])
    .returning(['id', 'name']);

  const notificationChannelIdByName = new Map(
    notificationChannels.map((channel) => [channel.name, channel.id]),
  );

  const notificationsRows = insertedDocumentRequests.flatMap((request, index) => {
    const filing = insertedFilings.find((candidate) => candidate.id === request.filing_id);
    const assignedUser = userAssignmentsRows[index]?.user_id;

    if (!filing || !assignedUser) {
      return [];
    }

    return [
      {
        tenant_id: filing.tenant_id,
        user_id: assignedUser,
        channel_id: notificationChannelIdByName.get(index % 2 === 0 ? 'in_app' : 'email'),
        payload: {
          title: index % 2 === 0 ? 'Document request pending' : 'Filing status changed',
          message:
            index % 2 === 0
              ? 'Client still needs to upload the insurance certificate.'
              : 'The filing was moved to the Submitted state.',
          filingId: filing.id,
          documentRequestId: request.id,
        },
      },
    ];
  });

  if (notificationsRows.length > 0) {
    await knex('notifications').insert(notificationsRows);
  }

  const calendarEventsRows = insertedFilings.flatMap((filing, index) => {
    const tenantName = filingFixtures[index].tenantName;
    const ownerEmail = tenantName === 'Acme Logistics' ? 'alice.admin@acme.test' : 'brian.boss@beta.test';
    const owner = usersByEmail.get(ownerEmail);

    if (!owner) {
      return [];
    }

    const start = new Date();
    start.setDate(start.getDate() + (index + 1));
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    return [
      {
        tenant_id: filing.tenant_id,
        user_id: owner.id,
        title:
          index % 2 === 0 ? 'Compliance review call' : 'Client document follow-up',
        description:
          index % 2 === 0
            ? 'Review outstanding compliance items with the client.'
            : 'Follow up with client regarding missing documents.',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      },
    ];
  });

  if (calendarEventsRows.length > 0) {
    await knex('calendar_events').insert(calendarEventsRows);
  }

  const auditEventsRows = insertedFilings.map((filing, index) => {
    const actorEmail = index % 2 === 0 ? 'alice.admin@acme.test' : 'brian.boss@beta.test';
    const actor = usersByEmail.get(actorEmail);

    return {
      user_id: actor?.id ?? null,
      event_name: index % 2 === 0 ? 'filing.status.changed' : 'document.request.created',
      payload:
        index % 2 === 0
          ? {
              filingId: filing.id,
              previousStatus: 'Draft',
              newStatus: filingFixtures[index].status,
            }
          : {
              filingId: filing.id,
              requestSummary: 'Request created via automated workflow',
            },
    };
  });

  await knex('audit_events').insert(auditEventsRows);
}
