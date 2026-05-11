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
  memberCount?: number;
  createdAt?: string;
  updatedAt?: string;
  limits?: {
    maxApiCalls?: number;
    maxStorage?: number;
    maxUsers?: number;
  };
  usage?: {
    apiCallsUsed?: number;
    storageUsed?: number;
    usersCount?: number;
    lastResetAt?: string;
  };
  subscription?: {
    _id: string;
    userId: string;
    tenantId: string;
    price: {
      _id: string;
      plan: string;
      name: string;
      displayName?: string;
      description?: string;
      price: number;
      interval: string;
      currency: string;
      stripePriceId: string;
      stripeProductId: string;
      isActive: boolean;
      isVisible: boolean;
      featuresList?: string[];
      features?: {
        dailyWebSearchLimit?: number;
        dailyDeepResearchLimit?: number;
        canInviteTeam?: boolean;
        unlimitedSeats?: boolean;
      };
      sortOrder?: number;
      metadata?: Record<string, unknown>;
      createdAt: string;
      updatedAt: string;
    };
    invoiceUrl?: string | null;
    usage?: {
      promptsUsed?: number;
      imagesUsed?: number;
    };
    createdAt: string;
    updatedAt: string;
  };
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
  /** From GET /tenant/user/:tenantId — total users in the tenant */
  usersCount?: number;
}

export interface TenantSettings {
  maxMembers?: number;
  allowMemberInvites?: boolean;
  [key: string]: unknown;
}

export interface TenantMember {
  _id: string;           // membership record ID
  userId: {
    _id: string;
    email: string;
  };
  tenantId: string;
  /** Tenant-scoped role; APIs often send this as `tenantRole` instead of `role`. */
  role: TenantRole | string;
  tenantRole?: TenantRole | string;
  permissions?: string[];
  status?: string;
  joinedAt?: string;
  lastAccessedAt?: string;
  createdAt?: string;
  updatedAt?: string;
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
  tenantId: string;
  email: string;
  role: TenantRole | string;
  message?: string;
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
  /** Invitation document id used by accept API (often same as `id` or `_id` from backend) */
  id: string;
  _id?: string;
  email: string;
  tenantName: string;
  tenantId: string;
  role: string;
  isUserExistWithEmail: boolean;
  inviterName?: string;
  expiresAt?: string;
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
