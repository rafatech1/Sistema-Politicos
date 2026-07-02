import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLeadSchema } from '@/lib/validations/lead.schema';
import { isLeadRateLimited } from '@/lib/leads/lead-rate-limit';
import { handleApiError, jsonError } from '@/lib/utils/api-response';
import { requestMeta } from '@/lib/utils/request-meta';

export async function POST(request: NextRequest) {
  try {
    const { website, ...data } = createLeadSchema.parse(await request.json());
    const meta = requestMeta(request);

    // Honeypot: campo escondido que só bots preenchem. Finge sucesso sem gravar.
    if (website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    if (await isLeadRateLimited(meta.ipAddress)) {
      return jsonError('Muitas mensagens enviadas. Tente novamente mais tarde.', 429);
    }

    const lead = await prisma.lead.create({
      data: {
        type: data.type,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        message: data.message || null,
        city: data.city || null,
        consentLGPD: data.consentLGPD,
        consentAt: new Date(),
        source: 'website',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
