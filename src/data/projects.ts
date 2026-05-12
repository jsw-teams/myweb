import type { GeneratedGitHubProject } from './generated/github-projects';

export type PublicProject = GeneratedGitHubProject;

// Backward-compatible export for older imports.
// Project data is generated from GitHub API only.
export const projects: PublicProject[] = [];
