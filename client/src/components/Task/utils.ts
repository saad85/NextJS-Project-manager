import { Status, Priority } from "./types";

export const statusVariants: Record<Status, string> = {
  backlog: "bg-gray-100 text-gray-800",
  todo: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
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
