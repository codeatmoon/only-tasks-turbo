import { App, Sprint, Task } from "./types";

export function isComplete(status?: string) {
  return status?.toLowerCase() === "complete";
}

export function findCurrentSprint(sprints: Sprint[]): Sprint | undefined {
  // Heuristic: name contains "Current" or latest sprint by id order
  return sprints.find((s) => /current/i.test(s.name)) ?? sprints[0];
}

export type BacklogGroup = { label: string; sprintId: string; tasks: Task[] };

export function splitCurrentAndBacklog(app?: App): {
  current?: Sprint;
  backlog: BacklogGroup[];
} {
  if (!app) return { current: undefined, backlog: [] };
  const current = findCurrentSprint(app.sprints);
  const backlog = app.sprints
    .filter((s) => s.id !== current?.id)
    .map((s) => ({
      label: `${s.name} - Backlog`,
      sprintId: s.id,
      tasks: s.tasks.filter((t) => !isComplete(String(t.status))),
    }))
    .filter((g) => g.tasks.length > 0);
  return { current, backlog };
}
