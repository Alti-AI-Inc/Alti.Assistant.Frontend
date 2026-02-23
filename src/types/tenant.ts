// Tenant Management Types

export enum TenantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum UserMode {
  PERSONAL = 'personal',
  TENANT = 'tenant',
}

export enum TenantStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  ownerId: string;
  plan: string;
  status: TenantStatus;
  settings?: TenantSettings;
  createdAt?: string;
  updatedAt?: string;
}

// User's tenant with their role (returned from /tenant/all)
export interface UserTenant {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  status: TenantStatus | string;
  plan: string;
  role: string;
  permissions?: string[];
  joinedAt?: string;
}

export interface TenantSettings {
  maxMembers?: number;
  allowMemberInvites?: boolean;
  [key: string]: unknown;
}

export interface TenantMember {
  userId: string;
  tenantId: string;
  role: TenantRole;
  email?: string;
  firstName?: string;
  lastName?: string;
  joinedAt?: string;
}

export interface TenantInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: TenantRole;
  token: string;
  status: InvitationStatus;
  invitedBy?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface TenantUsage {
  tenantId: string;
  memberCount: number;
  storageUsed?: number;
  apiCalls?: number;
  [key: string]: unknown;
}

export interface CreateTenantData {
  name: string;
  slug: string;
  subdomain: string;
}

export interface UpdateTenantSettingsData {
  settings: TenantSettings;
}

export interface CheckSubdomainAvailability {
  subdomain: string;
  available: boolean;
}

export interface InviteMemberData {
  email: string;
  role: TenantRole | string;
}

export interface UpdateMemberRoleData {
  role: TenantRole | string;
}

export interface SwitchTenantResponse {
  tenantId: string;
  tenantName: string;
  role: string;
  permissions: string[];
  accessToken: string;
}

export interface VerifyInvitationResponse {
  email: string;
  tenantName: string;
  tenantId: string;
  role: string;
  invitedBy?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
