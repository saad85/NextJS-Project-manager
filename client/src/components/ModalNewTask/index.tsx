import Modal from "@/components/Modal";
import {
  Priority,
  Status,
  useCreateTaskMutation,
  useGetUsersQuery,
  User,
} from "@/state/api";
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";
import s3 from "@/utils/AWS/aws-config"; // Import the AWS S3 configuration

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [file, setFile] = useState<File | null>(null); // State for file upload
  const [fileUploading, setFileUploading] = useState(false); // State for file upload loading

  // Fetch users using the hook directly
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  const handleSubmit = async () => {
    if (!title || !authorUserId || !(id !== null || projectId)) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    let fileUrl = "";

    // Upload file to AWS S3 if a file is selected
    if (file) {
      setFileUploading(true);
      try {
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: `uploads/${file.name}`, // Unique file name
          Body: file,
          ContentType: file.type,
        };
        const { Location } = await s3.upload(params).promise();
        if (Location) fileUrl = `uploads/${file.name}`;
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        alert("Failed to upload file. Please try again.");
        return;
      } finally {
        setFileUploading(false);
      }
    }

    await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      authorUserId: authorUserId,
      assignedUserId: assignedUserId || null,
      projectId: id !== null ? id : projectId,
      points: 40,
      attachmentUrl: fileUrl, // Add the file URL to the task data
    });
    onClose();
  };

  const isFormValid = () => {
    return title && authorUserId && !(id !== null && projectId);
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setStatus(Status.ToDo);
      setPriority(Priority.Backlog);
      setTags("");
      setStartDate("");
      setDueDate("");
      setAuthorUserId("");
      setAssignedUserId("");
      setProjectId("");
      setFile(null); // Reset file on modal close
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) =>
              setStatus(Status[e.target.value as keyof typeof Status])
            }
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <select
          className={selectStyles}
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
        >
          <option value="">Select Author</option>
          {usersLoading ? (
            <option disabled>Loading...</option>
          ) : (
            users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))
          )}
        </select>

        <select
          className={selectStyles}
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        >
          <option value="">Select Assigned User</option>
          {usersLoading ? (
            <option disabled>Loading...</option>
          ) : (
            users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))
          )}
        </select>

        {id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}

        {/* File Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Image
          </label>
          <input
            type="file"
            className={inputStyles}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading || fileUploading
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          disabled={!isFormValid() || isLoading || fileUploading}
        >
          {isLoading || fileUploading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
