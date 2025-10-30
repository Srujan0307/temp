
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Settings,
  HelpCircle,
  BarChart,
  DollarSign,
  FileText,
} from 'lucide-react';

import { NavLink } from './nav';

interface NavLinks {
  top: NavLink[];
  bottom: NavLink[];
}

export const navLinks: NavLinks = {
  top: [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      role: ['admin', 'member'],
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart,
      role: ['admin', 'member'],
    },
    {
      title: 'Billing',
      href: '/billing',
      icon: DollarSign,
      role: ['admin'],
    },
    {
      title: 'Clients',
      href: '/clients',
      icon: Briefcase,
      role: ['admin', 'member'],
    },
    {
      title: 'Filings',
      href: '/filings',
      icon: FileText,
      role: ['admin', 'member', 'auditor'],
    },
    {
      title: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      role: ['admin', 'member'],
    },
  ],
  bottom: [
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      role: ['admin'],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      role: ['admin'],
    },
    {
      title: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
    },
  ],
};
