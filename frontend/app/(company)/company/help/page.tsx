import { PageHeader } from '@/components/shared/page-header';
import { HelpCenter } from '@/components/shared/help-center';

export default function CompanyHelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help" description="Guides and answers for posting and hiring." />
      <HelpCenter role="company" />
    </div>
  );
}
