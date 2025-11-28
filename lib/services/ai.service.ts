// Placeholder for AI service integration
export const AIService = {
    async generateResume(userId: string) {
        // TODO: Implement AI generation logic
        return { success: true };
    },

    async matchJobs(userId: string) {
        // TODO: Implement job matching logic
        return [];
    }
    ,

    /**
     * Generate task suggestions from a project description.
     * This is a local heuristic generator (no external API required).
     */
    async generateProjectTasks(projectDescription: string, opts?: { numTasks?: number, budget?: number }) {
        const text = (projectDescription || '').trim();
        if (!text) return [];

        // Split by sentences and common delimiters to produce candidate steps
        const raw = text
            .replace(/\s+/g, ' ')
            .split(/[\.\n\r]+/)
            .map(s => s.trim())
            .filter(Boolean);

        const candidates: string[] = [];

        // Also split by semicolons and numbered lists
        for (const r of raw) {
            const parts = r.split(/;|, then |\bor\b|\band then\b|\band\b/).map(s => s.trim()).filter(Boolean);
            candidates.push(...parts);
        }

        // Deduplicate while preserving order
        const seen = new Set<string>();
        const dedup: string[] = [];
        for (const c of candidates) {
            const key = c.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                dedup.push(c);
            }
        }

        const target = opts?.numTasks || Math.min(6, Math.max(1, dedup.length));
        const selection = dedup.slice(0, target);

        // Map to task objects with simple heuristics for title/description/timeline/value
        const tasks = selection.map((s, idx) => {
            const words = s.split(/\s+/).slice(0, 6).join(' ');
            const title = words.charAt(0).toUpperCase() + words.slice(1);
            const estDays = Math.min(7, Math.max(1, Math.ceil((s.length / 80) + (idx % 3))));
            const value = opts?.budget ? Math.round((opts.budget / Math.max(1, target)) * (1 - idx * 0.05)) : undefined;
            return {
                title,
                description: s,
                timeline: { start: null, due: null, estimatedDays: estDays },
                price: value
            };
        });

        return tasks;
    }
};
