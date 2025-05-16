
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart, BarChart3, Shield, Ban } from "lucide-react";
import { useLocation } from "react-router-dom";

const DashboardSidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Content Monitor', href: '/monitor', icon: Shield },
    { name: 'Content Removal', href: '/removal', icon: Ban }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-5">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-md bg-brand flex items-center justify-center text-white font-semibold mr-2">RM</div>
          <div className="font-semibold text-xl">ReputeShield</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className={location.pathname === item.href ? "bg-brand-light text-white" : ""}>
                    <a href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-6 py-4">
        <div className="text-xs text-muted-foreground">© 2025 ReputeShield</div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
