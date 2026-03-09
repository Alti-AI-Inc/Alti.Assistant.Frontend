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

    // Backend may wrap the array under data.members
    return {
      success: result.success,
      message: result.message,
      data: Array.isArray(result.data)
        ? result.data
        : result.data?.members ?? [],
    };
  } catch (error: any) {
    console.error('Error getting tenant members:', error);
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

    // Backend may wrap the array under data.members
    return {
      success: result.success,
      message: result.message,
      data: Array.isArray(result.data)
        ? result.data
        : result.data?.members ?? [],
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
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/members/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to invite member');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error inviting member:', error);
    throw error;
  }
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

/**
 * Verify an invitation token (public - no auth required)
 */
export async function verifyInvitationToken(
  token: string
): Promise<ApiResponse<VerifyInvitationResponse>> {
  try {
    const response = await fetch(
      `${API_URL}/tenant/members/invitations/${token}/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid or expired invitation token');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error verifying invitation token:', error);
    throw error;
  }
}

/**
 * Accept an invitation (requires authentication)
 */
export async function acceptInvitation(
  token: string
): Promise<ApiResponse<{ tenantId: string; message: string }>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(
      `${API_URL}/tenant/members/invitations/${token}/accept`,
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
      const error = await response.json();
      throw new Error(error.message || 'Failed to accept invitation');
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
      const error = await response.json();
      throw new Error(error.message || 'Failed to update member role');
    }

    return await response.json();
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
