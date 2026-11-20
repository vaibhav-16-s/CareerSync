import { Loader } from '@/components/ui/loader';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader label="Loading…" />
    </div>
  );
}
