
import { Helmet } from 'react-helmet-async';
import EmergencyStrikeEngine from '@/components/aria/EmergencyStrikeEngine';
import AdminGuard from '@/components/auth/AdminGuard';

const EmergencyStrikePage = () => {
  return (
    <>
      <Helmet>
        <title>A.R.I.A/EX™ Emergency Strike Engine - Critical Threat Response</title>
        <meta name="description" content="Emergency Strike Engine for critical threat response and mitigation" />
      </Helmet>
      
      <AdminGuard>
        <div className="container mx-auto py-8">
          <EmergencyStrikeEngine />
        </div>
      </AdminGuard>
    </>
  );
};

export default EmergencyStrikePage;
