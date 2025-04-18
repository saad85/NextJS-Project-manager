"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Star,
  Calendar,
  Flag,
  Tag,
  CircleDashed,
  FileText,
} from "lucide-react";
import { TaskDetailsProps } from "./types";
import { statusVariants, priorityVariants, formatDate } from "./utils";
import { useGetTaskByIdQuery } from "@/state/api";
import Loading from "../Loading";

export function TaskDetails({ id }: TaskDetailsProps) {
  const { data: task, isLoading } = useGetTaskByIdQuery({ taskId: id });
  if (isLoading) return <Loading />;
  return (
    <TooltipProvider>
      <Card className="w-full lg:w-[100%]">
        <CardHeader>
          <CardTitle className="text-2xl">{task?.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {task?.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}

          {task?.taskAssignments && task.taskAssignments.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {task.taskAssignments.map((assignment) => (
                <Tooltip key={assignment.orgUserId}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            assignment?.orgUser?.user?.profilePictureUrl ||
                            undefined
                          }
                        />
                        <AvatarFallback>
                          {assignment?.orgUser?.user?.firstName?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {assignment?.orgUser?.user?.firstName}{" "}
                      {assignment?.orgUser?.user?.lastName}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CircleDashed className="h-4 w-4 flex-shrink-0" />
              {task?.status ? (
                <Badge className={statusVariants[task.status]}>
                  {task.status.replace("_", " ")}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">Not set</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Flag className="h-4 w-4 flex-shrink-0" />
              {task?.priority ? (
                <Badge className={priorityVariants[task.priority]}>
                  {task.priority}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">Not set</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground cursor-default">
                    {formatDate(task?.startDate)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start Date</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground cursor-default">
                    {formatDate(task?.dueDate)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Due Date</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {task?.points && (
            <div className="flex items-center gap-3">
              <Star className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{task.points}</p>
            </div>
          )}

          {task?.tags && (
            <div className="flex items-start gap-3">
              <Tag className="h-4 w-4 mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" key={task?.tags}>
                  {task?.tags}
                </Badge>
              </div>
            </div>
          )}

          {task?.attachments && task.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {task.attachments.map((attachment) => {
                  const isImage = attachment.fileName.match(
                    /\.(jpeg|jpg|gif|png|webp)$/i
                  );
                  return (
                    <Tooltip key={attachment.id}>
                      <TooltipTrigger asChild>
                        <div className="relative group cursor-pointer rounded-md overflow-hidden border">
                          {isImage ? (
                            <img
                              src={attachment.fileURL}
                              alt={attachment.fileName}
                              className="h-28 w-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="h-28 w-full flex flex-col items-center justify-center bg-gray-50 p-2">
                              <FileText className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-xs text-center text-gray-500 truncate w-full px-1">
                                {attachment.fileName}
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{attachment.fileName}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
