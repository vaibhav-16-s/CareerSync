import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { toast } from 'sonner';
import { internshipService, } from '@/services/internship.service';
import { qk } from '@/lib/query-keys';
export function useInternships(filters) {
    return useQuery({
        queryKey: qk.internships.list(filters),
        queryFn: () => internshipService.list(filters),
    });
}
export function useInternship(id, enabled = true) {
    return useQuery({
        queryKey: qk.internships.detail(id),
        queryFn: () => internshipService.getById(id),
        enabled: enabled && Boolean(id),
    });
}
export function useInternshipApplications(id, params) {
    return useQuery({
        queryKey: qk.internships.applications(id, params),
        queryFn: () => internshipService.applications(id, params),
        enabled: Boolean(id),
    });
}
export function useCreateInternship() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => internshipService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['internships', 'list'] });
            queryClient.invalidateQueries({ queryKey: qk.company.analytics });
            toast.success('Internship posted');
        },
    });
}
export function useUpdateInternship(id) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => internshipService.update(id, payload),
        onSuccess: (data) => {
            queryClient.setQueryData(qk.internships.detail(id), data);
            queryClient.invalidateQueries({ queryKey: ['internships', 'list'] });
            toast.success('Internship updated');
        },
    });
}
export function useDeleteInternship() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => internshipService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['internships', 'list'] });
            queryClient.invalidateQueries({ queryKey: qk.company.analytics });
            toast.success('Internship removed');
        },
    });
}
export function useApplyToInternship() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, coverLetter }) => internshipService.apply(id, coverLetter),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: qk.internships.detail(id) });
            queryClient.invalidateQueries({ queryKey: ['student', 'applications'] });
            queryClient.invalidateQueries({ queryKey: qk.student.dashboard });
            toast.success('Application submitted!');
        },
    });
}
