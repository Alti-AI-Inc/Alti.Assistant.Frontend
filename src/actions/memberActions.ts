'use server';

import { auth } from '@/auth';
import {
  ApiResponse,
  InviteMemberData,
  TenantInvitation,
  TenantMember,
  UpdateMemberRoleData,
  VerifyInvitationResponse,
} from '@/types/tenant';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Prefer tenant-scoped role fields from the membership payload.
 * Never trust `user.role` here because that can be a global app role.
 */
function membershipTenantRole(raw: Record<string, unknown>): string {
  const readRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

  const candidates = [
    raw,
    readRecord(raw.membership),
    readRecord(raw.member),
    readRecord(raw.data),
    readRecord(raw.userId),
  ].filter((value): value is Record<string, unknown> => value !== null);

  for (const candidate of candidates) {
    if (typeof candidate.tenantRole === 'string' && candidate.tenantRole.trim()) {
      return candidate.tenantRole.trim().toLowerCase();
    }
  }

  // Only fall back to top-level membership role fields, not nested user.role.
  for (const candidate of candidates.slice(0, 4)) {
    if (typeof candidate.role === 'string' && candidate.role.trim()) {
      return candidate.role.trim().toLowerCase();
    }
  }

  return 'member';
}

function normalizeTenantMember(raw: unknown): TenantMember | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;

  let userIdObj: { _id: string; email: string } | null = null;
  const uid = m.userId;
  if (typeof uid === 'string' && uid) {
    userIdObj = {
      _id: uid,
      email: typeof m.email === 'string' ? m.email : '',
    };
  } else if (uid && typeof uid === 'object') {
    const u = uid as Record<string, unknown>;
    const id =
      (typeof u._id === 'string' && u._id) ||
      (typeof u.id === 'string' && u.id) ||
      '';
    if (!id) return null;
    const nestedUser =
      u.user && typeof u.user === 'object'
        ? (u.user as Record<string, unknown>)
        : null;
    const email =
      (typeof u.email === 'string' && u.email) ||
      (nestedUser && typeof nestedUser.email === 'string'
        ? nestedUser.email
        : '') ||
      '';
    userIdObj = { _id: id, email };
  }
  if (!userIdObj) return null;

  const role = membershipTenantRole(m);
  const membershipId =
    (typeof m._id === 'string' && m._id) ||
    (typeof m.id === 'string' && m.id) ||
    '';

  return {
    _id: membershipId || `member-${userIdObj._id}`,
    userId: userIdObj,
    tenantId: String(m.tenantId ?? ''),
    role,
    tenantRole: role,
    permissions: Array.isArray(m.permissions)
      ? (m.permissions as string[])
      : undefined,
    status: typeof m.status === 'string' ? m.status : undefined,
    joinedAt: typeof m.joinedAt === 'string' ? m.joinedAt : undefined,
    lastAccessedAt:
      typeof m.lastAccessedAt === 'string' ? m.lastAccessedAt : undefined,
    createdAt: typeof m.createdAt === 'string' ? m.createdAt : undefined,
    updatedAt: typeof m.updatedAt === 'string' ? m.updatedAt : undefined,
  };
}

function extractInvitationPayload(
  result: Record<string, unknown>,
): TenantInvitation | null {
  const data = result.data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.token === 'string') return data as TenantInvitation;
    const nested = d.invitation;
    if (
      nested &&
      typeof nested === 'object' &&
      typeof (nested as TenantInvitation).token === 'string'
    ) {
      return nested as TenantInvitation;
    }
  }
  const top = result.invitation;
  if (
    top &&
    typeof top === 'object' &&
    typeof (top as TenantInvitation).token === 'string'
  ) {
    return top as TenantInvitation;
  }
  return null;
}

/**
 * Get all members of the current tenant
 */
export async function getTenantMembers(): Promise<ApiResponse<TenantMember[]>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get tenant members');
    }

    const result = await response.json();

    const rawList: unknown[] = Array.isArray(result.data)
      ? result.data
      : result.data?.members ?? [];

    const data = rawList
      .map(normalizeTenantMember)
      .filter((row): row is TenantMember => row !== null);

    return {
      success: result.success,
      message: result.message,
      data,
    };
  } catch (error: any) {
    console.error('Error getting tenant members:', error);
    throw error;
  }
}

/**
 * Get a single member of the current tenant by user id
 */
export async function getTenantMember(
  userId: string
): Promise<ApiResponse<TenantMember>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/members/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get tenant member');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting tenant member:', error);
    throw error;
  }
}

export async function getTenantMemberByTenantId(tenantId: string): Promise<ApiResponse<TenantMember[]>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/members/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get tenant members');
    }

    const result = await response.json();

    const rawList: unknown[] = Array.isArray(result.data)
      ? result.data
      : result.data?.members ?? [];

    const data = rawList
      .map(normalizeTenantMember)
      .filter((row): row is TenantMember => row !== null);

    return {
      success: result.success,
      message: result.message,
      data,
    };
  } catch (error: any) {
    console.error('Error getting tenant members by tenant ID:', error);
    throw error;
  }
}

/**
 * Invite a member to the current tenant
 */
export async function inviteMember(
  data: InviteMemberData
): Promise<ApiResponse<TenantInvitation>> {
  const fail = (message: string): ApiResponse<TenantInvitation> => ({
    success: false,
    message,
    data: null as unknown as TenantInvitation,
  });

  const session = await auth();
  if (!session?.accessToken) {
    return fail('You must be signed in to send invitations.');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/tenant/members/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        tenantId: data.tenantId,
        email: data.email,
        tenantRole: data.role,
        role: data.role,
        message: data.message ?? '',
      }),
    });
  } catch (e) {
    console.error('inviteMember network error:', e);
    return fail(
      e instanceof Error ? e.message : 'Network error while sending invitation',
    );
  }

  let result: Record<string, unknown>;
  try {
    result = (await response.json()) as Record<string, unknown>;
  } catch {
    return fail(`Invitation failed (${response.status})`);
  }

  const apiMessage =
    (typeof result.message === 'string' && result.message) ||
    (typeof result.error === 'string' && result.error) ||
    '';

  if (!response.ok) {
    return fail(apiMessage || `Request failed (${response.status})`);
  }

  if (result.success === false) {
    return fail(apiMessage || 'Failed to invite member');
  }

  const invitation = extractInvitationPayload(result);

  if (!invitation) {
    return fail(apiMessage || 'Unexpected response from server');
  }

  return {
    success: true,
    message: typeof result.message === 'string' ? result.message : undefined,
    data: invitation,
  };
}

/**
 * Get all pending invitations for the current tenant
 */
export async function getPendingInvitations(): Promise<
  ApiResponse<TenantInvitation[]>
> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/members/invitations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get pending invitations');
    }

    const result = await response.json();

    // Backend may wrap the array under data.invitations
    return {
      success: result.success,
      message: result.message,
      data: Array.isArray(result.data)
        ? result.data
        : result.data?.invitations ?? [],
    };
  } catch (error: any) {
    console.error('Error getting pending invitations:', error);
    throw error;
  }
}

function normalizeVerifyInvitationBody(
  raw: Record<string, unknown>,
  pathToken: string,
): VerifyInvitationResponse {
  const data =
    raw.data && typeof raw.data === 'object'
      ? (raw.data as Record<string, unknown>)
      : raw;

  const id =
    (typeof data._id === 'string' && data._id) ||
    (typeof data.id === 'string' && data.id) ||
    pathToken;

  return {
    id,
    _id: typeof data._id === 'string' ? data._id : undefined,
    email: String(data.email ?? ''),
    tenantName: String(data.tenantName ?? ''),
    tenantId: String(data.tenantId ?? ''),
    role: String(data.role ?? 'member'),
    isUserExistWithEmail: Boolean(data.isUserExistWithEmail),
    inviterName:
      typeof data.inviterName === 'string' ? data.inviterName : undefined,
    expiresAt:
      typeof data.expiresAt === 'string' ? data.expiresAt : undefined,
  };
}

/**
 * Verify an invitation token (public - no auth required)
 */
export async function verifyInvitationToken(
  token: string
): Promise<ApiResponse<VerifyInvitationResponse>> {
  try {
    const response = await fetch(
      `${API_URL}/tenant/members/invitations/${encodeURIComponent(token)}/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      let message = 'Invalid or expired invitation token';
      try {
        const err = (await response.json()) as Record<string, unknown>;
        if (typeof err.message === 'string') message = err.message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    const raw = (await response.json()) as Record<string, unknown>;
    const normalized = normalizeVerifyInvitationBody(raw, token);

    return {
      success: typeof raw.success === 'boolean' ? raw.success : true,
      message: typeof raw.message === 'string' ? raw.message : undefined,
      data: normalized,
    };
  } catch (error: any) {
    console.error('Error verifying invitation token:', error);
    throw error;
  }
}

/**
 * Accept an invitation (requires authentication).
 * Backend route: POST /tenant/:tenantId/members/invitations/:inviteId/accept
 * (`inviteId` is the invitation document id, often `_id` from verify / invite response.)
 */
export async function acceptInvitation(
  tenantId: string,
  inviteId: string
): Promise<ApiResponse<{ tenantId: string; message: string }>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    if (!tenantId?.trim() || !inviteId?.trim()) {
      throw new Error('Missing tenant or invitation id for accept');
    }

    const response = await fetch(
      `${API_URL}/tenant/${encodeURIComponent(tenantId)}/members/invitations/${encodeURIComponent(inviteId)}/accept`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      let message = 'Failed to accept invitation';
      try {
        const err = (await response.json()) as Record<string, unknown>;
        if (typeof err.message === 'string') message = err.message;
      } catch {
        try {
          const text = await response.text();
          if (text) message = text.slice(0, 200);
        } catch {
          /* ignore */
        }
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
}

/**
 * Update a member's role
 */
export async function updateMemberRole(
  userId: string,
  role: string
): Promise<ApiResponse<TenantMember>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(
      `${API_URL}/tenant/members/${userId}/role`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ role }),
      }
    );

    if (!response.ok) {
      let message = 'Failed to update member role';
      try {
        const err = (await response.json()) as Record<string, unknown>;
        if (typeof err.message === 'string') message = err.message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    let result: Record<string, unknown>;
    try {
      result = (await response.json()) as Record<string, unknown>;
    } catch {
      return {
        success: true,
        data: null as unknown as TenantMember,
        message: 'Role updated',
      };
    }

    if (result.success === false) {
      throw new Error(
        typeof result.message === 'string'
          ? result.message
          : 'Failed to update member role',
      );
    }

    const data =
      result.data !== undefined && result.data !== null
        ? (result.data as TenantMember)
        : (result as unknown as TenantMember);

    return {
      success: true,
      data,
      message:
        typeof result.message === 'string' ? result.message : undefined,
    };
  } catch (error: any) {
    console.error('Error updating member role:', error);
    throw error;
  }
}

/**
 * Remove a member from the tenant
 */
export async function removeMember(
  userId: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/members/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove member');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error removing member:', error);
    throw error;
  }
}

/**
 * Get invitations for the current user (across all tenants)
 */
export async function getUserInvitations(): Promise<
  ApiResponse<TenantInvitation[]>
> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/members/invitations/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user invitations');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting user invitations:', error);
    throw error;
  }
}

/**
 * Cancel a pending invitation
 */
export async function cancelInvitation(
  invitationId: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(
      `${API_URL}/tenant/members/invitations/${invitationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel invitation');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error canceling invitation:', error);
    throw error;
  }
}
