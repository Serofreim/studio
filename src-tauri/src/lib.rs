use std::path::PathBuf;
use serde::Serialize;

#[derive(Serialize)]
pub struct ValidationResult {
    pub is_valid: bool,
    pub message: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Check if a path is a valid Ren'Py project by looking for a 'game' directory
#[tauri::command]
fn validate_renpy_project(path: String) -> ValidationResult {
    let path_buf = PathBuf::from(&path);
    
    // Check if path exists and is a directory
    if !path_buf.exists() || !path_buf.is_dir() {
        return ValidationResult {
            is_valid: false,
            message: "Path does not exist or is not a directory".to_string(),
        };
    }
    
    // Check for 'game' subdirectory (required for Ren'Py projects)
    let game_dir = path_buf.join("game");
    if game_dir.exists() && game_dir.is_dir() {
        return ValidationResult {
            is_valid: true,
            message: "Valid Ren'Py project".to_string(),
        };
    }
    
    ValidationResult {
        is_valid: false,
        message: "Not a valid Ren'Py project. Missing 'game' directory".to_string(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, validate_renpy_project])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
