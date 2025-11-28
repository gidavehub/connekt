import { NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';

export async function POST(req: Request, { params }: { params: { taskId: string; proofId: string } }) {
    try {
        const { taskId, proofId } = params;
        const body = await req.json();
        const { reviewerId, approved, comment } = body;
        if (!reviewerId || typeof approved !== 'boolean') {
            return NextResponse.json({ error: 'reviewerId and approved(boolean) are required' }, { status: 400 });
        }

        await FirestoreService.reviewTaskProof(taskId, proofId, reviewerId, approved, comment);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
