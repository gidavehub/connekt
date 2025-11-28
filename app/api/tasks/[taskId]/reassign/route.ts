import { NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';

export async function POST(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { taskId } = params;
        const body = await req.json();
        const { newAssigneeId, performedBy } = body;
        if (!newAssigneeId || !performedBy) {
            return NextResponse.json({ error: 'newAssigneeId and performedBy are required' }, { status: 400 });
        }

        await FirestoreService.reassignTask(taskId, newAssigneeId, performedBy);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
