
import React from 'react';
import { NewCompany } from '@/types/newco';
import NewCompanyCard from './NewCompanyCard';
import { Card } from '@/components/ui/card';

interface NewCompanyFeedProps {
  companies: NewCompany[];
}

const NewCompanyFeed: React.FC<NewCompanyFeedProps> = ({ companies }) => {
  if (companies.length === 0) {
    return (
      <Card className="p-6 my-4 text-center">
        <p className="text-muted-foreground">No companies match your current filters.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 my-4 grid-cols-1">
      {companies.map((company) => (
        <NewCompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
};

export default NewCompanyFeed;
