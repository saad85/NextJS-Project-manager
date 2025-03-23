import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";

type TaskCardProps = {
  task: Task;
};

// Priority & Status Color Styles
const getPriorityColor = (priority: string | undefined) => {
  switch (priority) {
    case "Urgent":
      return "bg-red-100 text-red-700 border border-red-400";
    case "High":
      return "bg-yellow-100 text-yellow-700 border border-yellow-400";
    case "Medium":
      return "bg-green-100 text-green-700 border border-green-400";
    case "Low":
      return "bg-blue-100 text-blue-700 border border-blue-400";
    case "Backlog":
      return "bg-gray-100 text-gray-700 border border-gray-400";
    default:
      return "bg-gray-200 text-gray-800 border border-gray-300";
  }
};

const getTaskStatus = (status: string | undefined) => {
  switch (status) {
    case "ToDo":
      return "To Do";
    case "WorkInProgress":
      return "Work In Progress";
    case "UnderReview":
      return "Under Review";
    case "Completed":
      return "Completed";
    default:
      return "Unknown";
  }
};

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition dark:bg-dark-secondary dark:text-white">
      {/* Attachment Image */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <Image
            src={`/${task.attachments[0].fileURL}`}
            alt={task.attachments[0].fileName}
            width={400}
            height={200}
            className="rounded-lg object-cover"
          />
        </div>
      )}

      {/* Task Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {task.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Task Details */}
      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>ID:</strong> {task.id}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {task.description || "No description provided"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">
            {getTaskStatus(task.status)}
          </span>
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
        </p>
        <p>
          <strong>Due Date:</strong>{" "}
          {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
        </p>
        <p>
          <strong>Author:</strong>{" "}
          {task.author ? task.author.username : "Unknown"}
        </p>
        <p>
          <strong>Assignee:</strong>{" "}
          {task.assignee ? task.assignee.username : "Unassigned"}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;
