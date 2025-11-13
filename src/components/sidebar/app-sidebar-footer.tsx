import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GearSixIcon,
  BookIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { openUrl } from "@tauri-apps/plugin-opener";

interface AppSidebarFooterProps {
  onSettingsOpen: () => void;
}

export function AppSidebarFooter({ onSettingsOpen }: AppSidebarFooterProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const tooltipSide = isCollapsed ? "right" : "top";

  return (
    <SidebarMenu>
      <div className="flex gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    openUrl("https://serofreim.osias.dev/docs/getting-started")
                  }
                >
                  <BookIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side={tooltipSide}
                align="center"
                className="flex items-center gap-2"
              >
                Read the Documentation <ArrowSquareOutIcon />
              </TooltipContent>
            </Tooltip>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onSettingsOpen}>
                  <GearSixIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={tooltipSide} align="center">
                Settings
              </TooltipContent>
            </Tooltip>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
}
