"use client";

import {
  Priority,
  Status,
  useCreateTaskMutation,
  useGetUsersQuery,
  useLazyGetOrgUsersQuery,
} from "@/state/api";
import { formatISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, User, X } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import s3 from "@/utils/AWS/aws-config";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null;
};

const TaskModal = ({ isOpen, onClose, projectId = null }: TaskModalProps) => {
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
  const [customProjectId, setCustomProjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  const [
    getOrgUsers,
    { data: orgUsers, isLoading: isOrgUsersLoading, error: orgUsersError },
  ] = useLazyGetOrgUsersQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setIsCommandOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCommandFocus = () => {
    setIsCommandOpen(true);
    if (!orgUsers) {
      getOrgUsers();
    }
  };

  const handleAssignedChange = (id: string) => {
    if (assignedIds.includes(id)) {
      setAssignedIds((prev) => prev.filter((managerId) => managerId !== id));
    } else {
      setAssignedIds((prev) => [...prev, id]);
    }
  };

  const removeAssigned = (id: string) => {
    setAssignedIds((prev) => prev.filter((managerId) => managerId !== id));
  };

  const selectedManagers =
    orgUsers?.filter((user) => assignedIds.includes(user.id)) || [];

  const handleSubmit = async () => {
    if (!title || !authorUserId || !(projectId !== null || customProjectId))
      return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    let fileUrl = "";

    if (file) {
      setFileUploading(true);
      try {
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: `uploads/${file.name}`,
          Body: file,
          ContentType: file.type,
        };
        const { Location } = await s3.upload(params).promise();
        if (Location) fileUrl = `uploads/${file.name}`;
      } catch (error) {
        console.error("Error uploading file to S3:", error);
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
      authorUserId,
      assignedUserId: assignedUserId || null,
      projectId: projectId !== null ? projectId : customProjectId,
      points: 40,
      assignedIds,
      attachmentUrl: fileUrl,
    });
    onClose();
  };

  const isFormValid = () => {
    return title && authorUserId && (projectId !== null || customProjectId);
  };

  // Reset form when modal closes
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
      setCustomProjectId("");
      setAssignedIds([]);
      setFile(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as Status)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Status).map((statusValue) => (
                    <SelectItem key={statusValue} value={statusValue}>
                      {statusValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority).map((priorityValue) => (
                    <SelectItem key={priorityValue} value={priorityValue}>
                      {priorityValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Select
              value={authorUserId}
              onValueChange={setAuthorUserId}
              disabled={usersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {orgUsers?.map((user) => (
                  <SelectItem key={user.userId} value={user.id}>
                    {user.user.firstName} {user.user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assigned To</label>
            <Select
              value={assignedUserId}
              onValueChange={setAssignedUserId}
              disabled={usersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assigned user" />
              </SelectTrigger>
              <SelectContent>
                {orgUsers?.map((user) => (
                  <SelectItem key={user.userId} value={user.id}>
                    {user.user.firstName} {user.user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div ref={commandRef} className="space-y-2">
            <label className="text-sm font-medium">Additional Assignees</label>
            <Command>
              <CommandInput
                placeholder="Search team members..."
                onFocus={handleCommandFocus}
                onClick={() => setIsCommandOpen(true)}
              />
              {isCommandOpen && (
                <CommandGroup className="absolute z-10 w-full mt-1 border rounded-md shadow-lg bg-popover">
                  {isOrgUsersLoading ? (
                    <CommandEmpty>Loading team members...</CommandEmpty>
                  ) : orgUsersError ? (
                    <CommandEmpty>Error loading team members</CommandEmpty>
                  ) : orgUsers?.length === 0 ? (
                    <CommandEmpty>No team members available</CommandEmpty>
                  ) : (
                    <>
                      <CommandEmpty>No matching members found</CommandEmpty>
                      {orgUsers?.map(({ user, id }) => (
                        <CommandItem
                          key={id}
                          value={`${user.firstName} ${user.lastName}`}
                          onSelect={() => handleAssignedChange(id)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              assignedIds.includes(id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {user.firstName} {user.lastName}
                        </CommandItem>
                      ))}
                    </>
                  )}
                </CommandGroup>
              )}
            </Command>

            {selectedManagers.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedManagers.map(({ user, id }) => (
                  <Badge
                    key={id}
                    variant="outline"
                    className="flex items-center gap-2 py-1 px-2 rounded-full"
                  >
                    {user.profilePictureUrl ? (
                      <Image
                        src={user.profilePictureUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={20}
                        height={20}
                        className="rounded-full w-5 h-5 object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAssigned(id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {projectId === null && (
            <Input
              type="text"
              placeholder="Project ID"
              value={customProjectId}
              onChange={(e) => setCustomProjectId(e.target.value)}
              required={projectId === null}
            />
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Attachment</label>
            <Input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading || fileUploading}
              className="w-full sm:w-auto"
            >
              {isLoading || fileUploading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
