"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "@/components/sidebar/app-sidebar-header";
import { AppSidebarContent } from "@/components/sidebar/app-sidebar-content";
import { AppSidebarFooter } from "@/components/sidebar/app-sidebar-footer";

export interface NavItem {
  title: string;
  icon?: React.ElementType;
  isActive?: boolean;
  items?: {
    title: string;
    onClick?: () => void;
  }[];
}

interface AppSidebarProps {
  navItems: NavItem[];
  projectName: string;
  onPickProject: () => void;
  onSettingsOpen: () => void;
}

export function AppSidebar({
  navItems,
  projectName,
  onPickProject,
  onSettingsOpen,
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader
        projectName={projectName}
        onPickProject={onPickProject}
      />
      <SidebarContent>
        <AppSidebarContent items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter onSettingsOpen={onSettingsOpen} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
