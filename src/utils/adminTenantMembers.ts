import type {
  AdminTenantDetail,
  AdminTenantMember,
} from '@/actions/adminActions';

const MEMBER_LIST_KEYS = [
  'members',
  'users',
  'items',
  'records',
  'rows',
  'list',
  'results',
] as const;

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

function collectMemberRows(payload: unknown): unknown[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const root = readRecord(payload);
  if (!root) return [];

  for (const key of MEMBER_LIST_KEYS) {
    if (Array.isArray(root[key])) {
      return root[key] as unknown[];
    }
  }

  const data = root.data;
  if (Array.isArray(data)) return data;

  const nested = readRecord(data);
  if (nested) {
    for (const key of MEMBER_LIST_KEYS) {
      if (Array.isArray(nested[key])) {
        return nested[key] as unknown[];
      }
    }
  }

  return [];
}

export function normalizeAdminTenantMember(
  raw: unknown,
  fallbackTenantId?: string,
): AdminTenantMember | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  let userIdObj: { _id: string; email: string } | null = null;

  const uid = record.userId;
  if (typeof uid === 'string' && uid) {
    userIdObj = {
      _id: uid,
      email: typeof record.email === 'string' ? record.email : '',
    };
  } else if (uid && typeof uid === 'object') {
    const userRecord = uid as Record<string, unknown>;
    const id =
      (typeof userRecord._id === 'string' && userRecord._id) ||
      (typeof userRecord.id === 'string' && userRecord.id) ||
      '';
    if (!id) {
      return null;
    }

    const nestedUser = readRecord(userRecord.user);
    const email =
      (typeof userRecord.email === 'string' && userRecord.email) ||
      (nestedUser && typeof nestedUser.email === 'string'
        ? nestedUser.email
        : '') ||
      (typeof record.email === 'string' ? record.email : '') ||
      '';

    userIdObj = { _id: id, email };
  } else if (record.user && typeof record.user === 'object') {
    const userRecord = record.user as Record<string, unknown>;
    const id =
      (typeof userRecord._id === 'string' && userRecord._id) ||
      (typeof userRecord.id === 'string' && userRecord.id) ||
      '';
    if (id) {
      userIdObj = {
        _id: id,
        email: typeof userRecord.email === 'string' ? userRecord.email : '',
      };
    }
  }

  // Admin GET /admin/tenants/:id/members often returns flat User documents.
  if (!userIdObj) {
    const directId =
      (typeof record._id === 'string' && record._id) ||
      (typeof record.id === 'string' && record.id) ||
      '';
    if (directId) {
      userIdObj = {
        _id: directId,
        email:
          (typeof record.email === 'string' && record.email) ||
          (typeof record.name === 'string' ? record.name : '') ||
          '',
      };
    }
  }

  if (!userIdObj?._id) {
    return null;
  }

  const tenantId =
    (typeof record.tenantId === 'string' && record.tenantId) ||
    fallbackTenantId ||
    '';

  const membershipId =
    (typeof record._id === 'string' && record._id !== userIdObj._id
      ? record._id
      : '') ||
    (typeof record.id === 'string' && record.id !== userIdObj._id
      ? record.id
      : '') ||
    `member-${userIdObj._id}`;

  const role =
    typeof record.tenantRole === 'string'
      ? record.tenantRole
      : typeof record.role === 'string'
        ? record.role
        : undefined;

  return {
    _id: membershipId,
    userId: userIdObj,
    tenantId,
    role,
    tenantRole:
      typeof record.tenantRole === 'string' ? record.tenantRole : role,
    status: typeof record.status === 'string' ? record.status : undefined,
    joinedAt: typeof record.joinedAt === 'string' ? record.joinedAt : undefined,
    createdAt:
      typeof record.createdAt === 'string' ? record.createdAt : undefined,
  };
}

export function extractAdminMembersList(
  payload: unknown,
  fallbackTenantId?: string,
): AdminTenantMember[] {
  const rows = collectMemberRows(payload);
  const seen = new Set<string>();

  return rows
    .map(row => normalizeAdminTenantMember(row, fallbackTenantId))
    .filter((member): member is AdminTenantMember => {
      if (!member) return false;
      if (seen.has(member.userId._id)) return false;
      seen.add(member.userId._id);
      return true;
    });
}

export function adminTenantOwnerAsMember(
  ownerId: AdminTenantDetail['ownerId'],
  tenantId: string,
): AdminTenantMember | null {
  if (!ownerId) {
    return null;
  }

  if (typeof ownerId === 'string') {
    return {
      _id: `owner-${ownerId}`,
      userId: { _id: ownerId, email: ownerId },
      tenantId,
      role: 'owner',
      tenantRole: 'owner',
    };
  }

  const id = ownerId._id;

  if (!id) {
    return null;
  }

  return {
    _id: `owner-${id}`,
    userId: {
      _id: id,
      email: ownerId.email || id,
    },
    tenantId,
    role: 'owner',
    tenantRole: 'owner',
  };
}

export function resolveAssignableTenantMembers(
  members: AdminTenantMember[],
  detail: AdminTenantDetail | null,
  tenantId: string,
): AdminTenantMember[] {
  if (members.length > 0) {
    return members;
  }

  const ownerMember = adminTenantOwnerAsMember(detail?.ownerId, tenantId);
  return ownerMember ? [ownerMember] : [];
}
