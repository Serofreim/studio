import { Button } from "@/components/ui/button";

interface ProjectStudioProps {
  projectPath: string;
  onClear: () => Promise<void>;
}

export function ProjectStudio({ projectPath, onClear }: ProjectStudioProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Studio</h1>
      <p className="text-foreground/80 mb-6">
        <span className="font-semibold">Project Path:</span> {projectPath}
      </p>
      <Button onClick={onClear}>Remove Project</Button>
    </div>
  );
}
