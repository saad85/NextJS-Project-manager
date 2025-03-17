import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
  id: Number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface Task {
  id: Number;
  title: string;
  description?: string;
  status: string;
  priority: Priority;
  tags: string[];
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: Number;
  authorUserId: Number;
  assignedUserId?: Number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  reducerPath: "api",
  tagTypes: ["Projects"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"], // Invalidate the provided tags, and re fetch the query, so dont need to refetch again after post req
    }),
  }),
});

export default {} = api;
