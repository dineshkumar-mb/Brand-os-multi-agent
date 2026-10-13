import fs from "fs";
import path from "path";

let cachedWorkspaceRoot: string | null = null;

/**
 * Deterministically locates the root directory of the brand-os-multi-agent monorepo.
 * Searches up from process.cwd() and __dirname until it finds pnpm-workspace.yaml
 * or a package.json identifying the repository root.
 */
export function getWorkspaceRoot(): string {
  if (cachedWorkspaceRoot) {
    return cachedWorkspaceRoot;
  }

  // 1. Explicit environment variable override
  if (process.env.BRAND_OS_ROOT && fs.existsSync(process.env.BRAND_OS_ROOT)) {
    cachedWorkspaceRoot = path.resolve(process.env.BRAND_OS_ROOT);
    return cachedWorkspaceRoot;
  }

  if (process.env.WORKSPACE_ROOT && fs.existsSync(process.env.WORKSPACE_ROOT)) {
    cachedWorkspaceRoot = path.resolve(process.env.WORKSPACE_ROOT);
    return cachedWorkspaceRoot;
  }

  // Helper to check if a directory is the monorepo root
  const isRoot = (dir: string): boolean => {
    try {
      if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
        return true;
      }
      const pkgPath = path.join(dir, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        if (pkg.name === "brand-os-multi-agent" || (pkg.workspaces && Array.isArray(pkg.workspaces))) {
          return true;
        }
      }
    } catch {
      // Ignore read errors
    }
    return false;
  };

  // 2. Search upwards from process.cwd()
  let curr = path.resolve(process.cwd());
  while (true) {
    if (isRoot(curr)) {
      cachedWorkspaceRoot = curr;
      return cachedWorkspaceRoot;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }

  // 3. Search upwards from __dirname
  curr = path.resolve(__dirname);
  while (true) {
    if (isRoot(curr)) {
      cachedWorkspaceRoot = curr;
      return cachedWorkspaceRoot;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }

  // Fallback to process.cwd()
  cachedWorkspaceRoot = path.resolve(process.cwd());
  return cachedWorkspaceRoot;
}

/**
 * Resolves a path relative to the monorepo root.
 */
export function getWorkspacePath(...segments: string[]): string {
  return path.resolve(getWorkspaceRoot(), ...segments);
}
