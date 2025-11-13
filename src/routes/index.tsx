import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";
import { ProjectEmptyPath } from "@/components/project/empty";
import { ProjectStudio } from "@/components/project/studio";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { settings, updateProjectPath, loading } = useSettings();

  // Don't render until settings are loaded
  if (loading) {
    return null;
  }

  // Route based on settings, reactively updates when settings change
  if (!settings.projectPath || settings.projectPath === "") {
    return <ProjectEmptyPath onOpenProject={updateProjectPath} />;
  }

  return (
    <ProjectStudio
      projectPath={settings.projectPath}
      onClear={() => updateProjectPath("")}
      onProjectChange={updateProjectPath}
    />
  );
}
