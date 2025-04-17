import { User } from "@/state/api";

export type Status =
  | "Backlog"
  | "ToDo"
  | "WorkInProgress"
  | "Done"
  | "Canceled";
export type Priority = "Low" | "Medium" | "High" | "Urgent" | "Backlog";

import {
  Status as StatusEnum,
  Priority as PriorityEnum,
  Attachment as AttachmentEnum,
  TaskAssignment as TaskAssignmentEnum,
} from "@/state/api";

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
  status?: StatusEnum;
  priority?: PriorityEnum;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  attachments?: AttachmentEnum[];
  taskAssignments?: TaskAssignmentEnum[];
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
