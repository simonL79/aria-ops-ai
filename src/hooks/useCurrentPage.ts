
import { useLocation } from 'react-router-dom';

interface PageInfo {
  title: string;
  description: string;
}

export const useCurrentPage = (): PageInfo => {
  const location = useLocation();
  
  const pageMap: Record<string, PageInfo> = {
    '/dashboard': {
      title: 'Intelligence Dashboard',
      description: 'Real-time threat monitoring and reputation intelligence'
    },
    '/admin/genesis-sentinel': {
      title: 'Genesis Sentinel',
      description: 'Advanced threat detection and entity discovery'
    },
    '/admin/watchtower': {
      title: 'Watchtower',
      description: 'Continuous monitoring and surveillance operations'
    },
    '/admin/intelligence-core': {
      title: 'Intelligence Core',
      description: 'Central intelligence processing and analysis'
    },
    '/admin/persona-saturation': {
      title: 'Persona Saturation',
      description: 'Digital persona management and deployment'
    },
    '/admin/legal-ops': {
      title: 'Legal + Tactical Ops',
      description: 'Legal operations and tactical response coordination'
    },
    '/admin/clients': {
      title: 'Clients',
      description: 'Client management and configuration'
    },
    '/admin/qa-testing': {
      title: 'QA Testing',
      description: 'Quality assurance and system testing'
    },
    '/admin/settings': {
      title: 'Settings',
      description: 'System configuration and preferences'
    },
    '/blog': {
      title: 'Blog',
      description: 'Latest updates and insights'
    },
    '/contact': {
      title: 'Contact',
      description: 'Get in touch with our team'
    }
  };
  
  return pageMap[location.pathname] || {
    title: 'A.R.I.A.™',
    description: 'Advanced Reputation Intelligence Assistant'
  };
};
