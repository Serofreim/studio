import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => Promise<void>;
}

export function SettingsDialog({
  open,
  onOpenChange,
  onClear,
}: SettingsDialogProps) {
  const handleClear = async () => {
    await onClear();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="destructive"
            onClick={handleClear}
            className="w-full"
          >
            Close Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
