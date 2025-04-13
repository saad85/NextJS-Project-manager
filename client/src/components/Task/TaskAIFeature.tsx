"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Lightbulb, MessageSquare } from "lucide-react";

export function TaskAIFeatures() {
  const aiFeatures = [
    {
      title: "Generate Description",
      description: "Let AI help you write a detailed task description",
      icon: <BookOpen className="h-5 w-5" />,
      action: () => console.log("Generate Description"),
    },
    {
      title: "Suggest Improvements",
      description: "Get AI-powered suggestions to improve this task",
      icon: <Lightbulb className="h-5 w-5" />,
      action: () => console.log("Suggest Improvements"),
    },
    {
      title: "Auto-comment",
      description: "Generate a comment based on task changes",
      icon: <MessageSquare className="h-5 w-5" />,
      action: () => console.log("Auto-comment"),
    },
  ];

  return (
    <Card className="mt-4 w-full lg:w-[100%]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span>AI Features</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiFeatures.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">{feature.icon}</div>
            <div className="flex-1">
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={feature.action}>
              Try
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
