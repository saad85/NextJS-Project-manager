"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Comment, ActivityLog } from "./types";
import { formatDate } from "./utils";

interface TaskCommentsActivityProps {
  comments: Comment[];
  activityLogs: ActivityLog[];
  onAddComment: (content: string) => void;
}

export function TaskCommentsActivity({
  comments,
  activityLogs,
  onAddComment,
}: TaskCommentsActivityProps) {
  const [activeTab, setActiveTab] = useState("comments");
  const [commentContent, setCommentContent] = useState("");

  const handleSubmitComment = () => {
    if (commentContent.trim()) {
      onAddComment(commentContent);
      setCommentContent("");
    }
  };

  return (
    <Card className="mt-4 w-full lg:w-[100%]">
      <CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {activeTab === "comments" ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Add a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitComment}>Comment</Button>
              </div>
            </div>
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.author.profilePictureUrl || undefined}
                      />
                      <AvatarFallback>
                        {comment.author.firstName?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activityLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={log.user.profilePictureUrl || undefined}
                    />
                    <AvatarFallback>
                      {log.user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {log.user.firstName} {log.user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm capitalize">{log.action}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
