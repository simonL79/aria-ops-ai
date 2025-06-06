
import React from 'react';
import PublicPagesProtection from '@/components/layout/PublicPagesProtection';
import HomePage from './HomePage';

const Index = () => {
  console.log('Index component rendering...');
  return (
    <PublicPagesProtection>
      <HomePage />
    </PublicPagesProtection>
  );
};

export default Index;
