import type { AdminSubscriptionPackage } from '@/actions/adminActions';

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

function isPackageActive(record: Record<string, unknown>): boolean {
  if (record.isActive === false || record.active === false) {
    return false;
  }
  if (record.isVisible === false) {
    return false;
  }
  return true;
}

export function normalizeAdminSubscriptionPackage(
  raw: unknown,
): AdminSubscriptionPackage | null {
  const record = readRecord(raw);
  if (!record || !isPackageActive(record)) {
    return null;
  }

  const id =
    (typeof record._id === 'string' && record._id) ||
    (typeof record.id === 'string' && record.id) ||
    (typeof record.stripeProductId === 'string' && record.stripeProductId) ||
    '';

  if (!id) {
    return null;
  }

  const metadata = readRecord(record.metadata);
  const features = readRecord(record.features);
  const plan = String(record.plan ?? metadata?.plan ?? record.name ?? '')
    .trim()
    .toLowerCase();

  return {
    _id: id,
    plan: plan || 'package',
    name: String(record.name ?? record.displayName ?? 'Package'),
    displayName:
      typeof record.displayName === 'string' ? record.displayName : undefined,
    price:
      typeof record.price === 'number'
        ? record.price
        : Number(record.price) || 0,
    interval: String(record.interval ?? 'month'),
    features: features
      ? {
          dailyRequestLimit:
            typeof features.dailyRequestLimit === 'number'
              ? features.dailyRequestLimit
              : typeof features.dailyWebSearchLimit === 'number'
                ? features.dailyWebSearchLimit
                : undefined,
          ragType:
            typeof features.ragType === 'string' ? features.ragType : undefined,
          storagePerUser:
            typeof features.storagePerUser === 'number'
              ? features.storagePerUser
              : undefined,
          canInviteTeam:
            typeof features.canInviteTeam === 'boolean'
              ? features.canInviteTeam
              : undefined,
        }
      : undefined,
  };
}

export function extractAdminSubscriptionPackages(
  payload: unknown,
): AdminSubscriptionPackage[] {
  if (!payload) {
    return [];
  }

  const rows: unknown[] = [];

  if (Array.isArray(payload)) {
    rows.push(...payload);
  } else {
    const root = readRecord(payload);
    if (!root) {
      return [];
    }

    if (Array.isArray(root.data)) {
      rows.push(...root.data);
    }
    if (Array.isArray(root.packages)) {
      rows.push(...root.packages);
    }

    const products = root.products;
    if (Array.isArray(products)) {
      rows.push(...products);
    } else {
      const productContainer = readRecord(products);
      if (productContainer && Array.isArray(productContainer.data)) {
        rows.push(...productContainer.data);
      }
    }
  }

  const seen = new Set<string>();
  const packages: AdminSubscriptionPackage[] = [];

  for (const raw of rows) {
    const pkg = normalizeAdminSubscriptionPackage(raw);
    if (!pkg || seen.has(pkg._id)) {
      continue;
    }
    seen.add(pkg._id);
    packages.push(pkg);
  }

  return packages.sort((left, right) => left.price - right.price);
}
