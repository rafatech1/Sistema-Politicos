import { NextResponse, type NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { getSiteSettings, upsertSiteSettings } from '@/lib/services/site-settings.service';
import { siteSettingsSchema } from '@/lib/validations/site-settings.schema';
import { writeAuditLog } from '@/lib/audit/audit-log';
import { handleApiError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';

export async function GET() {
  try {
    const user = await requireUser();
    requirePermission(user, 'settings:read');

    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireUser();
    requirePermission(user, 'settings:write');

    const data = siteSettingsSchema.parse(await request.json());
    const before = await getSiteSettings();
    const updated = await upsertSiteSettings(data, user.id);

    const meta = requestMeta(request);
    await writeAuditLog({
      entityType: 'SiteSettings',
      entityId: String(updated.id),
      action: 'UPDATE',
      beforeJson: before,
      afterJson: updated,
      userId: user.id,
      userEmailSnapshot: user.email,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return NextResponse.json(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
