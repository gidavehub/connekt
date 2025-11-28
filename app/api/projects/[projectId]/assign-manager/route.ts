import { NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
    try {
        const { projectId } = params;
        const body = await req.json();
        const { managerId, managerType, transferredBy } = body;
        if (!managerId || !managerType || !transferredBy) {
            return NextResponse.json({ error: 'managerId, managerType and transferredBy are required' }, { status: 400 });
        }

        await FirestoreService.assignProjectManager(projectId, managerId, managerType, transferredBy);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
