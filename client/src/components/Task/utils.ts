import { Priority } from "./types";
import { Status as StatusEnum } from "@/state/api";

export const statusVariants: Record<StatusEnum, string> = {
  ToDo: "bg-blue-100 text-blue-800",
  WorkInProgress: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  UnderReview: "bg-red-100 text-red-800",
};

export const priorityVariants: Record<Priority, string> = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Urgent: "bg-red-100 text-red-800",
  Backlog: "bg-gray-100 text-gray-800",
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
