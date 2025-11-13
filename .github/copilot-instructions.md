# Copilot Instructions - Serofreim Studio

## Project Overview

**Serofreim Studio** is a cross-platform desktop application built with Tauri 2, React 19, TypeScript, and Vite. It's a visual editor for Ren'Py systems. The architecture separates frontend (React/TypeScript) from backend (Rust via Tauri IPC).

## Architecture

### Frontend Stack

- **Router**: TanStack React Router with file-based code generation (`src/routeTree.gen.ts`)
- **UI Components**: Custom components in `src/components/{ui,project}` using CVA variants + Tailwind CSS
- **Styling**: Tailwind CSS v4 + TailwindCSS Vite plugin, component utilities via `cn()` (clsx + twMerge)
- **State Management**: React hooks with Tauri Plugin Store for persistent settings

### Backend (Tauri)

- Located in `src-tauri/`
- Main entry: `src-tauri/src/main.rs` → delegates to `lib.rs`
- Communication: IPC commands (not yet implemented in this phase)
- Configuration: `tauri.conf.json` defines window dimensions (960x540), security, icons

### Build & Dev Workflow

```bash
pnpm dev          # Starts Vite at http://localhost:1420, Rust watches ignored
pnpm build        # Runs tsc then vite build
pnpm tauri        # Tauri CLI commands (dev, build)
```

**Key**: Vite is configured to ignore `src-tauri/` in watch mode; Tauri coordinates both frontend and backend builds.

## Project-Specific Patterns

### 1. Component Architecture (`src/components/`)

- **UI Components** (`ui/`): Reusable, unstyled-by-default components with CVA variants
  - Example: `Button` uses `buttonVariants` cva with `variant` and `size` options
  - Always destructure `className` and pass to `cn(buttonVariants({...}), className)`
  - Use `Slot` from `@radix-ui/react-slot` for polymorphic components (`asChild` pattern)
- **Project Components** (`project/`): Feature-specific, domain-driven components
  - Example: `ProjectStudio`, `ProjectEmptyPath` for conditional UI based on settings

### 2. Settings Management (`src/hook/useSettings.ts`)

- Custom hook leveraging Tauri Plugin Store for persistent settings
- Pattern: `getStore()` singleton, `useState` for reactive state, `useCallback` for mutations
- Settings interface defined at hook level (not centralized)
- Always await store operations; handle errors gracefully with console.error
- Scale by extending `Settings` interface and adding corresponding update functions

### 3. Routing with TanStack Router

- File-based routes auto-generated into `src/routeTree.gen.ts` (do not edit manually)
- Root route in `src/routes/__root.tsx` with `<Outlet />`
- Routes are async components; use `Suspense` or loaders for data fetching
- **Caveat**: Current index route incorrectly calls `useSettings()` in async component—should use a loader or move state to parent

### 4. Path Alias

- Configured in `tsconfig.json`: `@/*` → `./src/*`
- Always import UI components as `import { Button } from "@/components/ui/button"`

### 5. TypeScript Strict Mode

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- All React components must type props explicitly; use `React.ComponentProps<"element">` pattern
- Return types on functions are expected (especially route components)

## Critical Integration Points

### Tauri IPC (Future)

- Commands defined in Rust `src-tauri/src/lib.rs`
- Invoked from frontend via `@tauri-apps/api` (already imported)
- Plugin Store (`@tauri-apps/plugin-store`) handles persistent config
- Plugin Opener (`@tauri-apps/plugin-opener`) available for file operations

### Environment & Debugging

- `TAURI_DEV_HOST` env var controls dev server binding (for remote debugging)
- Window config (960x540) in `tauri.conf.json`; CSP is set to `null` (permissive for dev)

## Developer Workflows

### Adding a New Settings Value

1. Update `Settings` interface in `src/hook/useSettings.ts`
2. Add to `DEFAULT_SETTINGS`
3. Fetch from store in `loadSettings()` useEffect
4. Create `updateX()` callback function with same pattern as `updateProjectPath`
5. Export from return object

### Adding a New Component

1. **UI Component**: Create in `src/components/ui/name.tsx` with CVA variants, use `cn()` for className merging
2. **Feature Component**: Create in `src/components/project/name.tsx`, compose UI components, use hooks as needed
3. Import via `@/components/{ui,project}/name`

### Adding a Route

1. Create file `src/routes/path/to/route.tsx`
2. Export `Route` const using `createFileRoute("/path/to/route")` with component function
3. `routeTree.gen.ts` auto-updates on next dev server restart

### Building for Production

1. `pnpm build` compiles TypeScript and Vite
2. Tauri reads config from `tauri.conf.json`, runs `beforeBuildCommand`
3. Icons must exist in `src-tauri/icons/` (multiple formats for cross-platform)

## Key Files Reference

- `src/main.tsx` — React entry, router initialization
- `src/routes/__root.tsx` — Root layout
- `src/hook/useSettings.ts` — Settings state pattern (reference for new hooks)
- `src/components/ui/button.tsx` — UI component pattern
- `vite.config.ts` — Vite + Tauri integration setup
- `src-tauri/tauri.conf.json` — Window, security, build config
- `tsconfig.json` — Path aliases, strict mode

## No Existing Conventions

No prior `.cursorrules`, `.clinerules`, or `AGENT.md` files exist. These instructions are the primary AI guidance for this project.
