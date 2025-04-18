"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChecklistItem } from "./types";
import { useEffect, useState } from "react";
import {
  useCreateTaskChecklistMutation,
  useLazyGetTaskCheckListsQuery,
} from "@/state/api";
import Loading from "../Loading";

interface TaskChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string, completed: boolean) => void;
  taskId: string;
}

export function TaskChecklist({
  items,
  onToggleItem,
  taskId,
}: TaskChecklistProps) {
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [createTaskChecklistMutation] = useCreateTaskChecklistMutation();
  const [
    getTaskCheckLists,
    { data: taskChecklists, isLoading: isTaskChecklistsLoading },
  ] = useLazyGetTaskCheckListsQuery();

  useEffect(() => {
    getTaskCheckLists({ taskId });
  }, []);

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      createTaskChecklistMutation({
        title: newItemTitle,
        taskId: taskId,
        completed: false,
      });
      setNewItemTitle("");
      setIsAdding(false);
    }
  };

  if (isTaskChecklistsLoading) return <Loading />;

  return (
    <Card className="w-full lg:w-[100%]">
      <CardHeader>
        <CardTitle>Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {taskChecklists?.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={`checklist-${item.id}`}
              checked={item.completed}
              onCheckedChange={(checked) =>
                onToggleItem(item.id, checked as boolean)
              }
            />
            <label
              htmlFor={`checklist-${item.id}`}
              className={`text-sm font-medium leading-none ${
                item.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {item.title}
            </label>
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="New checklist item"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddItem();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewItemTitle("");
                }
              }}
            />
            <Button variant="ghost" size="sm" onClick={handleAddItem}>
              Add
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
