import { githubProjects } from '../data/generated/github-projects';
import type { PublicProject } from '../data/projects';

function getSortTime(project: PublicProject): number {
  const value = project.pushedAt || project.updatedAt || '';
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

export function getPublicProjects(): PublicProject[] {
  return [...githubProjects].sort((left, right) => {
    return getSortTime(right) - getSortTime(left) || left.name.localeCompare(right.name, 'en');
  });
}
