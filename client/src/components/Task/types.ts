import { User } from "@/state/api";

export type Status = "backlog" | "todo" | "in_progress" | "done" | "canceled";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface TaskAssignment {
  user: User;
  assignedAt: string;
  role: "assignee" | "reviewer";
}

export interface TaskDetailsProps {
  id: string;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string[];
  startDate?: string;
  dueDate?: string;
  points?: number;
  attachments?: Attachment[];
  taskAssignments?: TaskAssignment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: User;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
