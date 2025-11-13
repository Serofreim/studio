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
    console.log("Validating project at:", path);
    const result = await invoke<ValidationResult>("validate_renpy_project", {
      path,
    });
    console.log("Validation result:", result);
    return result;
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
    console.log("Opening folder picker...");
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Select a Ren'Py Project Folder",
    });

    console.log("Selection result:", selected);

    if (!selected) {
      console.log("No folder selected");
      return null;
    }

    // Validate the selected folder
    const selectedPath = selected as string;
    console.log("Validating selected path:", selectedPath);
    const validation = await validateRenPyProject(selectedPath);

    if (!validation.is_valid) {
      console.error("Invalid Ren'Py project:", validation.message);
      alert(`Invalid project: ${validation.message}`);
      return null;
    }

    console.log("Valid project selected:", selectedPath);
    return selectedPath;
  } catch (error) {
    console.error("Failed to pick project:", error);
    alert(`Failed to open project picker: ${error}`);
    return null;
  }
}
