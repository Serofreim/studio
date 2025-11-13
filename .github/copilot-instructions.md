# Copilot Instructions - Serofreim Studio

## Project Overview

**Serofreim Studio** is a cross-platform desktop application built with **Tauri 2**, **React 19**, **TypeScript**, and **Vite**. It's a visual editor for **Ren'Py** projects. The application features a responsive sidebar-based layout with dark mode, a three-column workspace (sidebar → breadcrumb/main content), project picker with validation, and persistent settings management.

## Architecture

### Frontend Stack

- **Router**: TanStack React Router with file-based code generation (`src/routeTree.gen.ts`)
- **Layout**: Sidebar-based responsive desktop UI with `SidebarProvider` from shadcn/ui
  - Header with project picker (dynamic tooltip positioning: bottom when expanded, right when collapsed)
  - Content area with breadcrumb navigation and main workspace
  - Collapsible sidebar with icon-only mode for vertical space optimization
  - Footer with documentation (BookIcon) and settings (GearSixIcon) buttons
- **UI Components**: shadcn/ui + Tailwind CSS v4 with oklch color space, CVA variants for component styling
  - Core components: sidebar, button, alert, dialog, breadcrumb, collapsible, tooltip, separator, empty, scroll-area, sheet, spinner, skeleton
- **Icons**: Phosphor React icons (`@phosphor-icons/react`) exclusively - **do NOT use lucide-react**
- **Tooltips**: shadcn/ui Tooltip with dynamic positioning (top/bottom when expanded, right when collapsed)
- **Styling**: Tailwind CSS v4 + TailwindCSS Vite plugin, dark mode enabled from startup via inline HTML styles
- **State Management**: React hooks with **global singleton pattern** in `useSettings.ts` to prevent multiple hook instances
- **Persistence**: Tauri Plugin Store for settings (`projectPath` stored in `settings.json` with auto-save)
- **File Operations**: Tauri dialog plugin v2 for native folder picker; `@tauri-apps/plugin-opener` for URL navigation

### Backend (Tauri)

- Located in `src-tauri/`
- Main entry: `src-tauri/src/main.rs` → delegates to `lib.rs`
- **Window Config**: `tauri.conf.json` defines dimensions (960x540), dark theme, security, icons
- **Project Validation**: Rust backend validates Ren'Py projects by checking for `game/` subdirectory
- **Desktop-Only**: Application targets desktop platforms (Windows, macOS, Linux) with responsive sidebar layout

### Build & Dev Workflow

```bash
pnpm dev          # Starts Vite at http://localhost:1420, Rust watches ignored
pnpm build        # Runs tsc then vite build
pnpm tauri        # Tauri CLI commands (dev, build)
```

**Key**: Vite is configured to ignore `src-tauri/` in watch mode; Tauri coordinates both frontend and backend builds.

## Project-Specific Patterns

### 1. Component Architecture (`src/components/`)

- **UI Components** (`ui/`): Reusable shadcn/ui components with CVA variants
  - Example: `Button` uses `buttonVariants` cva with `variant` and `size` options
  - Buttons use `size="icon"` for icon-only mode in footer
  - Always destructure `className` and pass to `cn(buttonVariants({...}), className)`
  - Use `Slot` from `@radix-ui/react-slot` for polymorphic components (`asChild` pattern)
- **Sidebar Components** (`sidebar/`):
  - `app-sidebar.tsx` — Main sidebar wrapper with collapsible state
  - `app-sidebar-header.tsx` — Project picker button with dynamic tooltips
  - `app-sidebar-content.tsx` — Navigation systems with collapsible menu items
  - `app-sidebar-footer.tsx` — Documentation (BookIcon) and settings (GearSixIcon) buttons with dynamic tooltips
  - All use `useSidebar()` hook to determine collapsed state for responsive behavior
- **Project Components** (`project/`):
  - `studio.tsx` — Main workspace with breadcrumb and three-column layout
  - `empty.tsx` — Empty state UI for project selection with error handling

### 2. Settings Management (`src/hooks/useSettings.ts`)

- **Global Singleton Pattern**: Prevents multiple hook instances causing state conflicts
- **Key Features**:
  - Module-level global state: `globalSettings`, `globalLoading`, `settingsListeners` Set
  - Single store initialization: `initializeSettings()` runs once at module import
  - Listener pattern: Multiple hook instances subscribe to state changes via `settingsListeners`
  - Memory safe: `isMountedRef` prevents state updates on unmounted components
- **Pattern**: `getStore()` singleton, `useState` for reactive state, `useCallback` for mutations
- **Settings interface**: Only `projectPath: string | null` currently
- **Scaling**: Add new settings by:
  1. Extending `Settings` interface
  2. Adding to `DEFAULT_SETTINGS`
  3. Creating `updateX()` callback in `useSettings` hook
- **Persistence**: Auto-saved to `settings.json` via Tauri Plugin Store

### 3. Tooltip System (Dynamic Positioning)

- All interactive elements use shadcn/ui `Tooltip` component
- **Dynamic Positioning**: Tooltips use sidebar state to optimize placement:
  - When sidebar **expanded**: `side="bottom"` for header, `side="top"` for footer buttons
  - When sidebar **collapsed**: `side="right"` for all tooltips
- **Implementation**:

  ```tsx
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const tooltipSide = isCollapsed ? "right" : "bottom"; // or "top" for footer

  <Tooltip>
    <TooltipTrigger asChild>
      <Button>...</Button>
    </TooltipTrigger>
    <TooltipContent side={tooltipSide}>Content</TooltipContent>
  </Tooltip>;
  ```

- **Accessibility**: All buttons show tooltips always, not just on hover

### 4. Routing with TanStack Router

- File-based routes auto-generated into `src/routeTree.gen.ts` (do not edit manually)
- Root route in `src/routes/__root.tsx` with `<Outlet />`
- **Settings-Aware Routing**: `index.tsx` waits for settings to load, then routes conditionally:
  - No `projectPath` → `ProjectEmptyPath` (project picker)
  - Valid `projectPath` → `ProjectStudio` (workspace)
- Routes use `useSettings()` hook to read persistent state

### 5. Path Alias

- Configured in `tsconfig.json`: `@/*` → `./src/*`
- Always import as: `import { Button } from "@/components/ui/button"`
- Always import from project structure: `import { ProjectStudio } from "@/components/project/studio"`

### 6. TypeScript Strict Mode

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- All React components must type props explicitly
- Return types on functions expected (especially route components)
- Use `React.ComponentProps<"element">` for polymorphic component props

### 7. Performance Optimization

- **Memoization**: Use `useMemo` for computed values and item arrays
- **Callback Stability**: Use `useCallback` for event handlers to prevent unnecessary re-renders
- **Component Memoization**: Complex components use memo pattern with proper dependency tracking
- Example (studio.tsx):
  ```tsx
  const projectName = useMemo(
    () => projectPath.split("/").pop() || "Project",
    [projectPath]
  );
  const handleSceneClick = useCallback(() => {
    setActiveView("scenes");
  }, []);
  ```

### 8. State Propagation

- After updating project path in settings, wait 100ms for state propagation
- Pattern in `empty.tsx`:
  ```tsx
  if (selectedPath) {
    await onOpenProject(selectedPath);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  ```

## Critical Integration Points

### Tauri Features Used

- **Plugin Store** (`@tauri-apps/plugin-store`): Persistent settings with auto-save
- **Plugin Opener** (`@tauri-apps/plugin-opener`): Opens URLs in default browser
- **Dialog Plugin v2** (`@tauri-apps/plugin-dialog`): Native folder picker
- **Window Config** (`tauri.conf.json`): Dark theme, 960x540 dimensions, security settings

### Dark Mode

- Enabled from app startup via inline HTML styles in `index.html`
- Prevents white flash during React hydration
- Tailwind dark mode classes apply automatically to all components
- Theme colors defined in `src/App.css` using oklch color space

### Environment & Debugging

- `TAURI_DEV_HOST` env var controls dev server binding (for remote debugging)
- Window config (960x540) in `tauri.conf.json`
- CSP is permissive for development (set to `null`)
- No console.log statements in production code (clean output)

## Developer Workflows

### Adding a New Settings Value

1. Update `Settings` interface in `src/hooks/useSettings.ts`
2. Add to `DEFAULT_SETTINGS`
3. Fetch from store in `initializeSettings()` function
4. Create `updateX()` callback function with same pattern as `updateProjectPath`
5. Export from return object

### Adding a New Component

1. **UI Component**: Create in `src/components/ui/name.tsx` with CVA variants, use `cn()` for className merging
2. **Feature Component**: Create in `src/components/project/name.tsx` or `src/components/sidebar/name.tsx`, compose UI components, use hooks as needed
3. Import via `@/components/{ui,project,sidebar}/name`
4. Add `cursor-pointer` class to all interactive elements

### Adding a Tooltip

1. Import `Tooltip`, `TooltipContent`, `TooltipTrigger` from `@/components/ui/tooltip`
2. Import `useSidebar` from `@/components/ui/sidebar` if positioning should be dynamic
3. Wrap button with Tooltip structure:
   ```tsx
   <Tooltip>
     <TooltipTrigger asChild>
       <Button>...</Button>
     </TooltipTrigger>
     <TooltipContent side={tooltipSide}>Text</TooltipContent>
   </Tooltip>
   ```
4. For dynamic positioning: `const tooltipSide = isCollapsed ? "right" : "bottom";`

### Adding a Route

1. Create file `src/routes/path/to/route.tsx`
2. Export `Route` const using `createFileRoute("/path/to/route")` with component function
3. `routeTree.gen.ts` auto-updates on next dev server restart
4. Use `useSettings()` hook to access persistent project path

### Building for Production

1. `pnpm build` compiles TypeScript and Vite
2. Tauri reads config from `tauri.conf.json`, runs `beforeBuildCommand`
3. Icons must exist in `src-tauri/icons/` (multiple formats for cross-platform)
4. Remove any console.log statements (keep codebase clean)

## Key Files Reference

- `src/main.tsx` — React entry, router initialization
- `src/routes/__root.tsx` — Root layout with loading spinner
- `src/routes/index.tsx` — Settings-aware router (ProjectEmptyPath vs ProjectStudio)
- `src/hooks/useSettings.ts` — Global singleton settings pattern (reference for new hooks)
- `src/hooks/useProjectPicker.ts` — Project folder selection and validation
- `src/components/ui/button.tsx` — UI component pattern with CVA variants
- `src/components/ui/tooltip.tsx` — Tooltip component with positioning
- `src/components/sidebar/app-sidebar.tsx` — Main sidebar wrapper
- `src/components/sidebar/app-sidebar-header.tsx` — Project picker with dynamic tooltip
- `src/components/sidebar/app-sidebar-footer.tsx` — Documentation and settings buttons with dynamic tooltips
- `src/components/project/studio.tsx` — Main workspace with performance optimizations
- `src/components/project/empty.tsx` — Empty state with project picker
- `src/components/settings/settings-dialog.tsx` — Settings dialog with project removal
- `vite.config.ts` — Vite + Tauri integration setup
- `src-tauri/tauri.conf.json` — Window, security, build config
- `tsconfig.json` — Path aliases, strict mode
- `src/App.css` — Theme colors with oklch color space

## No Existing Conventions

No prior `.cursorrules`, `.clinerules`, or `AGENT.md` files exist. These instructions are the primary AI guidance for this project.
