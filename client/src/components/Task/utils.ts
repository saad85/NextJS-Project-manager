import { Priority } from "./types";
import { Status as StatusEnum } from "@/state/api";

export const statusVariants: Record<StatusEnum, string> = {
  ToDo: "bg-blue-100 text-blue-800",
  WorkInProgress: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  UnderReview: "bg-red-100 text-red-800",
};

export const priorityVariants: Record<Priority, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
