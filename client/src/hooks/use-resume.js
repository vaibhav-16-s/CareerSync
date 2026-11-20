import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resumeService } from '@/services/resume.service';
const keys = {
    dashboard: ['resume', 'dashboard'],
    versions: ['resume', 'versions'],
    detail: (id) => ['resume', 'detail', id],
};
export function useResumeDashboard() {
    return useQuery({ queryKey: keys.dashboard, queryFn: () => resumeService.dashboard() });
}
export function useResumeVersions() {
    return useQuery({ queryKey: keys.versions, queryFn: () => resumeService.versions() });
}
export function useResumeVersion(id) {
    return useQuery({
        queryKey: keys.detail(id),
        queryFn: () => resumeService.getById(id),
        enabled: Boolean(id),
    });
}
export function useUploadResumeAnalysis() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (file) => resumeService.upload(file),
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['resume'] });
            qc.invalidateQueries({ queryKey: ['student'] });
            toast.success(`Resume analyzed — score ${data.report?.overallScore ?? '—'}/100`);
        },
        onError: (err) => {
            const msg = err?.response?.data?.error
                ?.message ?? 'Analysis failed';
            toast.error(msg);
        },
    });
}
export function useAnalyzeResumeText() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ text, name }) => resumeService.analyzeText(text, name),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['resume'] });
            qc.invalidateQueries({ queryKey: ['student'] });
        },
        onError: (err) => {
            const msg = err?.response?.data?.error
                ?.message ?? 'Analysis failed';
            toast.error(msg);
        },
    });
}
export function useRewriteResume() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => resumeService.rewrite(id),
        onSuccess: (_d, id) => {
            qc.invalidateQueries({ queryKey: keys.detail(id) });
            toast.success('Resume rewrite ready');
        },
    });
}
export function useDeleteResumeVersion() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => resumeService.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['resume'] });
            toast.success('Version deleted');
        },
    });
}
