import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  MessageSquare,
  Upload,
  Users,
  ChevronsLeft,
  Shield,
  Users as UsersIcon,
  Rocket,
  Eye,
  AlertTriangle,
  Settings,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";

const navigationItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mentions",
    href: "/dashboard/mentions", 
    icon: MessageSquare,
  },
  {
    title: "Engagement Hub",
    href: "/dashboard/engagement",
    icon: Users,
  },
  {
    title: "ARIA Ingest",
    href: "/dashboard/aria-ingest",
    icon: Upload,
  },
];

const adminMenuItems = [
  { icon: Shield, label: 'System Health', href: '/admin' },
  { icon: UsersIcon, label: 'Clients', href: '/admin/clients' },
  { icon: Rocket, label: 'Persona Saturation', href: '/admin/persona-saturation' },
  { icon: Eye, label: 'Genesis Sentinel', href: '/admin/genesis-sentinel' },
  { icon: AlertTriangle, label: 'QA Testing', href: '/admin/qa' },
  { icon: Settings, label: 'System Config', href: '/admin/system' },
  { icon: Terminal, label: 'Ghost Protocol', href: '/admin/operator' }
];

const DashboardNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary h-10 px-4 py-2 md:hidden">
          Open Navigation
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader className="text-left">
          <SheetTitle>Dashboard Navigation</SheetTitle>
          <SheetDescription>
            Navigate through the different sections of your dashboard.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <Accordion type="single" collapsible>
          {navigationItems.map((item) => (
            <AccordionItem value={item.title} key={item.title}>
              <AccordionTrigger asChild>
                <Link
                  to={item.href}
                  className="flex items-center space-x-2 py-2 hover:underline"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </AccordionTrigger>
              <AccordionContent className="pl-8">
                Additional content or sub-navigation can go here.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center space-x-2 py-2 hover:underline">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>shadcn</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardNavigation;
