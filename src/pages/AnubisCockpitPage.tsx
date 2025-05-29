
import { Helmet } from 'react-helmet-async';
import AnubisCockpit from '@/components/aria/AnubisCockpit';
import LiveDataGuard from '@/components/dashboard/LiveDataGuard';

const AnubisCockpitPage = () => {
  return (
    <>
      <Helmet>
        <title>Anubis Cockpit - A.R.I.A™ Security Control Center</title>
        <meta name="description" content="Advanced security monitoring and control dashboard for A.R.I.A™ Anubis system" />
      </Helmet>
      
      <LiveDataGuard enforceStrict={true}>
        <div className="container mx-auto py-8">
          <AnubisCockpit />
        </div>
      </LiveDataGuard>
    </>
  );
};

export default AnubisCockpitPage;
