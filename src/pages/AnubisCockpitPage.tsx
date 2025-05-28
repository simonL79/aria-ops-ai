
import { Helmet } from 'react-helmet-async';
import AnubisCockpit from '@/components/aria/AnubisCockpit';

const AnubisCockpitPage = () => {
  return (
    <>
      <Helmet>
        <title>Anubis Cockpit - A.R.I.A™ Security Control Center</title>
        <meta name="description" content="Advanced security monitoring and control dashboard for A.R.I.A™ Anubis system" />
      </Helmet>
      
      <div className="container mx-auto py-8">
        <AnubisCockpit />
      </div>
    </>
  );
};

export default AnubisCockpitPage;
