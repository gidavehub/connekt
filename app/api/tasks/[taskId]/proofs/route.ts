import { NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';

export async function POST(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { taskId } = params;
        const body = await req.json();
        const { submitterId, type, url, metadata } = body;
        if (!submitterId || !type || !url) {
            return NextResponse.json({ error: 'submitterId, type and url are required' }, { status: 400 });
        }

        await FirestoreService.submitTaskProof(taskId, {
            submitterId,
            type,
            url,
            metadata
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
    try {
        const { taskId } = params;
        const proofs = await FirestoreService.getTaskProofs(taskId);
        return NextResponse.json({ success: true, proofs });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
