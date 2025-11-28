import { NextResponse } from 'next/server';
import { AIService } from '@/lib/services/ai.service';
import { FirestoreService } from '@/lib/services/firestore-service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { projectDescription, opts, workspaceId } = body;
        if (!projectDescription) return NextResponse.json({ error: 'projectDescription is required' }, { status: 400 });

        if (!workspaceId) return NextResponse.json({ error: 'workspaceId is required to check plan' }, { status: 400 });

        const ws = await FirestoreService.getWorkspace(workspaceId);
        if (!ws) return NextResponse.json({ error: 'workspace not found' }, { status: 404 });
        if (ws.plan !== 'pro') return NextResponse.json({ error: 'AI automation is available for Pro plan only' }, { status: 403 });

        const tasks = await AIService.generateProjectTasks(projectDescription, opts || {});
        return NextResponse.json({ success: true, tasks });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
