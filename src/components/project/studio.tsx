import { useState, useCallback, useMemo } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SettingsDialog } from "../settings/settings-dialog";
import { pickRenPyProject } from "@/hooks/useProjectPicker";
import {
  GraphIcon,
  ChartDonutIcon,
  MonitorIcon,
  TreeStructureIcon,
  ChartBarIcon,
} from "@phosphor-icons/react";

interface ProjectStudioProps {
  projectPath: string;
  onClear: () => Promise<void>;
  onProjectChange?: (path: string) => Promise<void>;
}

type WorkspaceView = "scenes" | "flowchart" | "overview";

export function ProjectStudio({
  projectPath,
  onClear,
  onProjectChange,
}: ProjectStudioProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<WorkspaceView>("scenes");
  const [activeSystem, setActiveSystem] = useState<string>("Dynamic Options");

  const handlePickProject = useCallback(async () => {
    const newPath = await pickRenPyProject();
    if (newPath && onProjectChange) {
      await onProjectChange(newPath);
    }
  }, [onProjectChange]);

  const projectName = useMemo(
    () =>
      projectPath.split("\\").pop() ||
      projectPath.split("/").pop() ||
      "Project",
    [projectPath]
  );

  const viewLabel = useMemo(() => {
    switch (activeView) {
      case "scenes":
        return "Define Scenes";
      case "flowchart":
        return "Flowchart Editor";
      case "overview":
        return "Overview";
      default:
        return "Define Scenes";
    }
  }, [activeView]);

  const handleSceneClick = useCallback(() => {
    setActiveView("scenes");
    setActiveSystem("Dynamic Options");
  }, []);

  const handleFlowchartClick = useCallback(() => {
    setActiveView("flowchart");
    setActiveSystem("Dynamic Options");
  }, []);

  const handleOverviewClick = useCallback(() => {
    setActiveView("overview");
    setActiveSystem("Analytics");
  }, []);

  const navItems = useMemo(
    () => [
      {
        title: "Dynamic Options",
        icon: GraphIcon,
        isActive: true,
        items: [
          {
            title: "Define Scenes",
            icon: MonitorIcon,
            onClick: handleSceneClick,
          },
          {
            title: "Flowchart Editor",
            icon: TreeStructureIcon,
            onClick: handleFlowchartClick,
          },
        ],
      },
      {
        title: "Analytics",
        icon: ChartDonutIcon,
        items: [
          {
            title: "Overview",
            icon: ChartBarIcon,
            onClick: handleOverviewClick,
          },
        ],
      },
    ],
    [handleSceneClick, handleFlowchartClick, handleOverviewClick]
  );

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          navItems={navItems}
          projectName={projectName}
          onPickProject={handlePickProject}
          onSettingsOpen={() => setSettingsOpen(true)}
        />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <span className="text-sm text-foreground/60">
                      {projectName}
                    </span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem className="hidden md:block">
                    <span className="text-sm text-foreground/60">
                      {activeSystem}
                    </span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <span className="text-sm text-foreground">{viewLabel}</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {/* Workspace content based on active view */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {activeView === "scenes" && (
              <div>Define Scenes content goes here</div>
            )}
            {activeView === "flowchart" && (
              <div>Flowchart Editor content goes here</div>
            )}
            {activeView === "overview" && <div>Overview content goes here</div>}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onClear={onClear}
      />
    </>
  );
}
