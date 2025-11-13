import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

interface ValidationResult {
  is_valid: boolean;
  message: string;
}

export async function validateRenPyProject(
  path: string
): Promise<ValidationResult> {
  try {
    return await invoke<ValidationResult>("validate_renpy_project", {
      path,
    });
  } catch (error) {
    console.error("Failed to validate project:", error);
    return {
      is_valid: false,
      message: `Error validating project: ${error}`,
    };
  }
}

export async function pickRenPyProject(): Promise<string | null> {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Select a Ren'Py Project Folder",
    });

    if (!selected) {
      return null;
    }

    const selectedPath = selected as string;
    const validation = await validateRenPyProject(selectedPath);

    if (!validation.is_valid) {
      console.error("Invalid Ren'Py project:", validation.message);
      alert(`Invalid project: ${validation.message}`);
      return null;
    }

    return selectedPath;
  } catch (error) {
    console.error("Failed to pick project:", error);
    alert(`Failed to open project picker: ${error}`);
    return null;
  }
}
