import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './auth';

export async function withAuth(
  handler: (req: NextRequest, { userId, role }: { userId: string; role: string }) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return handler(req, decoded);
  };
}

export async function withAdminAuth(
  handler: (req: NextRequest, { userId, role }: { userId: string; role: string }) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    return handler(req, decoded);
  };
}
