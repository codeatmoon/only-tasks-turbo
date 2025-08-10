import { Project } from "../lib/types";

export const projects: Project[] = [
  {
    id: "proj1",
    name: "Demo Project",
    apps: [
      {
        id: "app1",
        name: "Sample App",
        options: {
          status: ["Not started", "Reviewing", "In-progress", "Complete"],
          priority: ["Low", "Medium", "High"],
          assignees: [
            "PM",
            "Designer",
            "Engineer",
            "Marketer",
            "QA",
            "Team Lead",
          ],
        },
        columns: [
          { id: "col1", name: "Estimate", key: "estimate", type: "Number" },
          { id: "col2", name: "Link", key: "link", type: "Link" },
        ],
        sprints: [
          {
            id: "sprint3",
            name: "Sprint 3 (Current)",
            tasks: [
              {
                id: "t1",
                name: "Update strategic planning deck",
                assignee: "PM",
                priority: "High",
                status: "In-progress",
                dueDate: "2025-08-15",
                estimate: 3,
              },
              {
                id: "t2",
                name: "Approve landing page",
                assignee: "Designer",
                priority: "Medium",
                status: "Not started",
                dueDate: "2025-08-20",
                link: "https://example.com/prd",
              },
              {
                id: "t5",
                name: "Instrument analytics events",
                assignee: "Engineer",
                priority: "Low",
                status: "Reviewing",
                dueDate: "2025-08-18",
                estimate: 2,
              },
            ],
          },
          {
            id: "sprint2",
            name: "Sprint 2",
            tasks: [
              {
                id: "t3",
                name: "Revise marketing copy",
                assignee: "Marketer",
                priority: "Medium",
                status: "In-progress",
                dueDate: "2025-07-14",
              },
              {
                id: "t6",
                name: "QA regression suite",
                assignee: "QA",
                priority: "High",
                status: "Not started",
                dueDate: "2025-07-22",
              },
            ],
          },
          {
            id: "sprint1",
            name: "Sprint 1",
            tasks: [
              {
                id: "t4",
                name: "Requirement document created",
                assignee: "Sam G",
                priority: "Medium",
                status: "Complete",
                dueDate: "2025-07-10",
              },
            ],
          },
        ],
      },
    ],
  },
];
