import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp,
    orderBy,
    limit,
    DocumentData,
    Timestamp,
    increment,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';

// --- Types (Exported for reuse) ---

export interface UserProfile {
    uid: string;
    username?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    role: 'employer' | 'va' | 'agency' | 'admin';
    subRole?: string; // For admin users
    bio?: string;
    skills?: string[];
    onboardingCompleted: boolean;
    introSeen?: boolean; // For post-onboarding intro flow
    agencyId?: string; // If they belong to an agency
    createdAt: any;
}

export interface Project {
    id?: string;
    ownerId: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
    status: 'active' | 'completed' | 'on-hold';
    createdAt: any;
}

export interface Task {
    id?: string;
    projectId: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done' | 'paid'; // Added 'paid'
    priority: 'low' | 'medium' | 'high';
    assignee?: string; // Username (kept for compatibility)
    assigneeId?: string; // UID of assignee
    value?: number; // For milestone payments
    timeline?: { start?: string; due?: string };
    reassignable?: boolean; // Can Owners/Supervisors reassign this task
    proofRequired?: boolean; // Does completion require proof submission?
    createdAt: any;
}

export interface Workspace {
    id?: string;
    ownerId: string;
    name: string;
    plan: 'free' | 'pro';
    members?: string[]; // uids
    createdAt: any;
}

export interface TaskProof {
    id?: string;
    taskId: string;
    submitterId: string;
    type: 'screenshot' | 'video' | 'link' | 'other';
    url: string;
    metadata?: any;
    status: 'pending' | 'approved' | 'rejected';
    reviewerId?: string;
    reviewComment?: string;
    submittedAt: any;
    reviewedAt?: any;
}

export interface Job {
    id?: string;
    ownerId: string;
    title: string;
    description: string;
    budget: string;
    type: 'fixed' | 'hourly';
    skills: string[];
    location?: string;
    timezone?: string;
    language?: string;
    createdAt: any;
}

export interface Transaction {
    id?: string;
    fromId: string;
    toId: string;
    amount: number;
    type: 'payment' | 'deposit' | 'withdrawal';
    status: 'pending' | 'completed' | 'failed';
    taskId?: string; // If linked to a task
    createdAt: any;
}

export const FirestoreService = {

    // ==========================================
    // USER & IDENTITY MANAGEMENT
    // ==========================================

    async createUserProfile(uid: string, data: Partial<UserProfile>) {
        await setDoc(doc(db, 'users', uid), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
    },

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? (snap.data() as UserProfile) : null;
    },

    async checkUsernameAvailability(username: string): Promise<boolean> {
        if (!username) return false;
        const snap = await getDoc(doc(db, 'usernames', username.toLowerCase()));
        return !snap.exists();
    },

    async reserveUsername(username: string, uid: string) {
        await setDoc(doc(db, 'usernames', username.toLowerCase()), { uid });
    },

    async getUidByUsername(username: string): Promise<string | null> {
        const snap = await getDoc(doc(db, 'usernames', username.toLowerCase()));
        return snap.exists() ? snap.data().uid : null;
    },

    // ==========================================
    // PROJECTS & WORKSPACE
    // ==========================================

    async createProject(project: Omit<Project, 'id' | 'createdAt'>) {
        return await addDoc(collection(db, 'projects'), {
            ...project,
            createdAt: serverTimestamp()
        });
    },

    async getProjects(userId: string, role: string) {
        // If VA/Agency, might need to query 'members' subcollection in future
        // For now, simple owner check
        const q = query(
            collection(db, 'projects'),
            where('ownerId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
    },

    async getProjectById(projectId: string): Promise<Project | null> {
        const snap = await getDoc(doc(db, 'projects', projectId));
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
    },

    async getProjectStats(userId: string) {
        const projects = await this.getProjects(userId, 'employer'); // logic can expand
        const total = projects.length;
        const completed = projects.filter(p => p.status === 'completed').length;
        const active = projects.filter(p => p.status === 'active').length;
        const pending = projects.filter(p => p.status === 'on-hold').length;

        return { total, completed, running: active, pending };
    },

    // ==========================================
    // TASKS (KANBAN)
    // ==========================================

    async createTask(task: Omit<Task, 'id' | 'createdAt'>) {
        return await addDoc(collection(db, 'tasks'), {
            ...task,
            createdAt: serverTimestamp()
        });
    },

    async getTasks(projectId: string) {
        const q = query(
            collection(db, 'tasks'),
            where('projectId', '==', projectId),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
    },

    async updateTaskStatus(taskId: string, status: Task['status']) {
        await updateDoc(doc(db, 'tasks', taskId), { status });
    },

    async deleteTask(taskId: string) {
        await deleteDoc(doc(db, 'tasks', taskId));
    },

    // ==========================================
    // WORKSPACES & ADVANCED TASK FLOWS
    // ==========================================

    async createWorkspace(ownerId: string, data: Omit<Workspace, 'id' | 'createdAt' | 'ownerId'>) {
        return await addDoc(collection(db, 'workspaces'), {
            ownerId,
            ...data,
            members: [ownerId],
            createdAt: serverTimestamp()
        });
    },

    async getWorkspace(workspaceId: string) {
        const snap = await getDoc(doc(db, 'workspaces', workspaceId));
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Workspace) : null;
    },

    async addWorkspaceMember(workspaceId: string, uid: string) {
        const wsRef = doc(db, 'workspaces', workspaceId);
        const snap = await getDoc(wsRef);
        if (!snap.exists()) throw new Error('Workspace not found');
        await updateDoc(wsRef, { members: arrayUnion(uid) });
    },

    async removeWorkspaceMember(workspaceId: string, uid: string) {
        const wsRef = doc(db, 'workspaces', workspaceId);
        const snap = await getDoc(wsRef);
        if (!snap.exists()) throw new Error('Workspace not found');
        await updateDoc(wsRef, { members: arrayRemove(uid) });
    },

    // Submit proof for a task (stored in subcollection tasks/{taskId}/proofs)
    async submitTaskProof(taskId: string, proof: Omit<TaskProof, 'id' | 'submittedAt' | 'status'>) {
        return await addDoc(collection(db, 'tasks', taskId, 'proofs'), {
            ...proof,
            status: 'pending',
            submittedAt: serverTimestamp()
        });
    },

    async getTaskProofs(taskId: string) {
        const q = query(collection(db, 'tasks', taskId, 'proofs'), orderBy('submittedAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as TaskProof));
    },

    // Review a proof: approve or reject
    async reviewTaskProof(taskId: string, proofId: string, reviewerId: string, approved: boolean, comment?: string) {
        const proofRef = doc(db, 'tasks', taskId, 'proofs', proofId);
        await updateDoc(proofRef, {
            status: approved ? 'approved' : 'rejected',
            reviewerId,
            reviewComment: comment || null,
            reviewedAt: serverTimestamp()
        });

        // If approved, optionally mark task as done (Supervisor action)
        if (approved) {
            await updateDoc(doc(db, 'tasks', taskId), { status: 'done', validatedBy: reviewerId });
        }
    },

    // Reassign a task and log the reassignment in a subcollection
    async reassignTask(taskId: string, newAssigneeId: string, performedBy: string) {
        const taskRef = doc(db, 'tasks', taskId);
        const snap = await getDoc(taskRef);
        if (!snap.exists()) throw new Error('Task not found');
        const old = snap.data() as any;
        await updateDoc(taskRef, { assigneeId: newAssigneeId });
        await addDoc(collection(db, 'tasks', taskId, 'reassignments'), {
            from: old.assigneeId || old.assignee || null,
            to: newAssigneeId,
            by: performedBy,
            at: serverTimestamp()
        });
    },

    // Assign a project to a manager (internal or external)
    async assignProjectManager(projectId: string, managerId: string, managerType: 'user' | 'external', transferredBy: string) {
        await updateDoc(doc(db, 'projects', projectId), {
            managerId,
            managerType,
            transferredAt: serverTimestamp(),
            transferredBy
        });
    },

    // ==========================================
    // JOBS & MARKETPLACE
    // ==========================================

    async createJob(job: Omit<Job, 'id' | 'createdAt'>) {
        return await addDoc(collection(db, 'jobs'), {
            ...job,
            createdAt: serverTimestamp()
        });
    },

    async getJobs(limitCount = 20) {
        const q = query(
            collection(db, 'jobs'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
    },

    async getJobById(jobId: string): Promise<Job | null> {
        const snap = await getDoc(doc(db, 'jobs', jobId));
        return snap.exists() ? ({ id: snap.id, ...snap.data() } as Job) : null;
    },

    // ==========================================
    // AGENCY MANAGEMENT
    // ==========================================

    async createAgency(ownerId: string, data: any) {
        const agencyRef = await addDoc(collection(db, 'agencies'), {
            ownerId,
            ...data,
            members: [ownerId], // Owner is first member
            createdAt: serverTimestamp()
        });

        // Link owner to agency
        await updateDoc(doc(db, 'users', ownerId), {
            agencyId: agencyRef.id,
            role: 'agency' // Upgrade role
        });

        return agencyRef.id;
    },

    async getAgency(agencyId: string) {
        const snap = await getDoc(doc(db, 'agencies', agencyId));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    // ==========================================
    // WALLET & TRANSACTIONS (Basic)
    // ==========================================

    async releasePayment(taskId: string, amount: number, fromUid: string, toUsername: string) {
        // 1. Get Recipient UID
        const toUid = await this.getUidByUsername(toUsername);
        if (!toUid) throw new Error("Recipient not found");

        // 2. Create Transaction Record
        await addDoc(collection(db, 'transactions'), {
            fromId: fromUid,
            toId: toUid,
            amount: amount,
            taskId: taskId,
            type: 'payment',
            status: 'completed',
            createdAt: serverTimestamp()
        });

        // 3. Mark Task as Paid
        await updateDoc(doc(db, 'tasks', taskId), { status: 'paid' });

        // Note: Real balance updates would require Cloud Functions or Transactions
        // to safely increment/decrement wallet fields atomically.
    }
};
