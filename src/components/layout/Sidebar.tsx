import { useState } from "react";
import {
  Gauge,
  ListChecks,
  LayoutDashboard,
  Brain,
  Radar,
  Activity,
  Settings,
  Search,
  Building2
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/ui/theme-provider"

interface SidebarProps {
  isLoading: boolean;
}

export function Sidebar({ isLoading }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setTheme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = (checked: boolean) => {
    setIsDarkTheme(checked);
    setTheme(checked ? "dark" : "light");
  };

  const routes = [
    {
      label: "Dashboard",
      icon: <Gauge className="h-4 w-4" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Intelligence",
      icon: <Brain className="h-4 w-4" />,
      href: "/dashboard/intelligence",
      active: pathname === "/dashboard/intelligence",
    },
    {
      label: "Radar",
      icon: <Radar className="h-4 w-4" />,
      href: "/dashboard/radar",
      active: pathname === "/dashboard/radar",
    },
    {
      label: "AI Scraping",
      icon: <Search className="h-4 w-4" />,
      href: "/dashboard/ai-scraping",
      active: pathname === "/dashboard/ai-scraping",
    },
    {
      label: "Monitor",
      icon: <Activity className="h-4 w-4" />,
      href: "/dashboard/monitor",
      active: pathname === "/dashboard/monitor",
    },
    {
      label: "New Companies",
      icon: <Building2 className="h-4 w-4" />,
      href: "/dashboard/new-companies",
      active: pathname === "/dashboard/new-companies",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/settings",
      active: pathname === "/settings",
    }
  ];

  return (
    <div className="flex h-full max-w-xs flex-col space-y-1">
      <div className="px-4 py-2">
        <h1 className="font-bold text-xl">A.R.I.A.™</h1>
        <p className="text-muted-foreground text-sm">
          Advanced Reputation Intelligence Assistant
        </p>
      </div>
      <Separator />
      <ScrollArea className="flex-1 space-y-2 p-4">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        )}
        {!isLoading && (
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                className={`h-9 w-full justify-start ${
                  route.active ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
                onClick={() => navigate(route.href)}
              >
                {route.icon}
                <span>{route.label}</span>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="theme">
            <AccordionTrigger>Preferences</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center justify-between space-x-2">
                <p className="text-sm font-medium">Dark Mode</p>
                <Switch
                  id="dark-mode"
                  checked={isDarkTheme}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Separator />
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 w-full justify-start">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">shadcn</p>
                <p className="text-xs text-muted-foreground">
                  m@example.com
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Sidebar;
