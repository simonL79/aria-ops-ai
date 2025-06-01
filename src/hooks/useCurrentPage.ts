
import { useLocation } from 'react-router-dom';

interface PageInfo {
  title: string;
  description: string;
}

export const useCurrentPage = (): PageInfo => {
  const location = useLocation();
  
  const pageMap: Record<string, PageInfo> = {
    '/': {
      title: 'A.R.I.A.™',
      description: 'Advanced Reputation Intelligence Assistant'
    },
    '/dashboard': {
      title: 'Intelligence Dashboard',
      description: 'Real-time threat monitoring and reputation intelligence'
    },
    '/admin': {
      title: 'Admin Dashboard',
      description: 'System administration and management'
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
      title: 'Client Management',
      description: 'Client management and configuration'
    },
    '/admin/qa-testing': {
      title: 'QA Testing',
      description: 'Quality assurance and system testing'
    },
    '/admin/settings': {
      title: 'System Settings',
      description: 'System configuration and preferences'
    },
    '/blog': {
      title: 'Blog',
      description: 'Latest updates and insights'
    },
    '/contact': {
      title: 'Contact',
      description: 'Get in touch with our team'
    },
    '/about': {
      title: 'About',
      description: 'Learn more about A.R.I.A.™'
    },
    '/scan': {
      title: 'Reputation Scan',
      description: 'Advanced reputation monitoring and analysis'
    },
    '/auth': {
      title: 'Authentication',
      description: 'Sign in to your account'
    }
  };
  
  // Get the current page info, defaulting to a generic page if not found
  const currentPageInfo = pageMap[location.pathname];
  
  if (currentPageInfo) {
    return currentPageInfo;
  }
  
  // Handle dynamic routes or fallback
  if (location.pathname.startsWith('/blog/')) {
    return {
      title: 'Blog Post',
      description: 'Article content and insights'
    };
  }
  
  // Default fallback
  return {
    title: 'A.R.I.A.™',
    description: 'Advanced Reputation Intelligence Assistant'
  };
};
