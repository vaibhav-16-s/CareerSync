import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { applicationService } from '@/services/application.service';
import { qk } from '@/lib/query-keys';
export function useMyApplications(params) {
    return useQuery({
        queryKey: qk.student.applications(params),
        queryFn: () => applicationService.mine(params),
    });
}
export function useWithdrawApplication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => applicationService.withdraw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student', 'applications'] });
            queryClient.invalidateQueries({ queryKey: qk.student.dashboard });
            toast.success('Application withdrawn');
        },
    });
}
export function useUpdateApplicationStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, note, }) => applicationService.updateStatus(id, status, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['company', 'applicants'] });
            queryClient.invalidateQueries({ queryKey: ['internships', 'applications'] });
            queryClient.invalidateQueries({ queryKey: qk.company.analytics });
            toast.success('Status updated');
        },
    });
}
export function useAddApplicationNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, text }) => applicationService.addNote(id, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['company', 'applicants'] });
            queryClient.invalidateQueries({ queryKey: ['internships', 'applications'] });
            toast.success('Note added');
        },
    });
}
