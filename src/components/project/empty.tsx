import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FolderSimpleIcon,
  ArrowSquareOutIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { pickRenPyProject } from "@/hooks/useProjectPicker";
import { useState } from "react";

interface ProjectEmptyPathProps {
  onOpenProject: (path: string) => Promise<void>;
}

export function ProjectEmptyPath({ onOpenProject }: ProjectEmptyPathProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const selectedPath = await pickRenPyProject();
      if (selectedPath) {
        await onOpenProject(selectedPath);
        // Wait a moment for state to propagate
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        setError(
          "Invalid Ren'Py project. Please ensure the folder contains a 'game' directory."
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error opening project:", err);
      setError(`Error: ${err}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 flex flex-col justify-center items-center min-h-screen min-w-screen">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderSimpleIcon />
          </EmptyMedia>
          <EmptyTitle>Open a Ren&apos;py Project</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t open any project yet. Get started by opening a
            project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                openUrl("https://serofreim.osias.dev/docs/getting-started")
              }
            >
              Learn from Documentation <ArrowSquareOutIcon />
            </Button>
            <Button onClick={handleOpenProject} disabled={isLoading}>
              {isLoading ? "Opening..." : "Open a Project"}
            </Button>
          </div>
        </EmptyContent>
      </Empty>
      {error && (
        <Alert variant="destructive" className="mb-4 text-left">
          <WarningCircleIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
