
import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Gauge, Image, PenSquare, Rocket, Zap } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Gauge,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Rocket,
  },
  {
    name: "Content",
    href: "/content",
    icon: Image,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: Zap,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-6">
        <div className="flex items-center gap-2">
          <PenSquare size={24} className="text-sidebar-foreground" />
          <span className="text-xl font-bold">AdLaunchGenie</span>
        </div>
        <SidebarTrigger className="ml-auto">
          <ChevronRight size={16} />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
