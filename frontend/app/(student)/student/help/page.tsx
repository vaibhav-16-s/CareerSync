import { PageHeader } from '@/components/shared/page-header';
import { HelpCenter } from '@/components/shared/help-center';

export default function StudentHelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help" description="Guides and answers to get you hired faster." />
      <HelpCenter role="student" />
    </div>
  );
}
