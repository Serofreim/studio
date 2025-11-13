import {
  useSidebar,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CaretUpDownIcon } from "@phosphor-icons/react";

interface AppSidebarHeaderProps {
  projectName: string;
  onPickProject: () => void;
}

export function AppSidebarHeader({
  projectName,
  onPickProject,
}: AppSidebarHeaderProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const tooltipSide = isCollapsed ? "right" : "bottom";

  return (
    <SidebarHeader>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton asChild>
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={onPickProject}
            >
              <CaretUpDownIcon className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
                {projectName}
              </span>
            </Button>
          </SidebarMenuButton>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide} align="center">
          Change Project
        </TooltipContent>
      </Tooltip>
    </SidebarHeader>
  );
}
