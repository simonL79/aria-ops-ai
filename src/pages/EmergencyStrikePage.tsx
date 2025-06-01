
import { Helmet } from 'react-helmet-async';
import EmergencyStrikeEngine from '@/components/aria/EmergencyStrikeEngine';
import AdminGuard from '@/components/auth/AdminGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';

const EmergencyStrikePage = () => {
  return (
    <>
      <Helmet>
        <title>A.R.I.A/EX™ Emergency Strike Engine - Critical Threat Response</title>
        <meta name="description" content="Emergency Strike Engine for critical threat response and mitigation" />
      </Helmet>
      
      <AdminGuard>
        <DashboardLayout>
          <div className="container mx-auto py-8">
            <EmergencyStrikeEngine />
          </div>
        </DashboardLayout>
      </AdminGuard>
    </>
  );
};

export default EmergencyStrikePage;
