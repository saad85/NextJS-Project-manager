"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useGetProjectsQuery } from "@/state/api"; // Adjust the import based on your project structure
import { Button } from "@/components/ui/button"; // Import Button from shadcn/ui
import { formatDate } from "date-fns";
import {
  ClipboardList, // For Total Tasks
  Clock, // For In Progress Tasks
  CheckCircle, // For Completed Tasks
  Calendar, // For Start Date
  CalendarCheck, // For End Date
  Plus, // Add icon for the New Project button
} from "lucide-react";
import ProjectModal from "./ProjectModal";
import { useState } from "react";
import Header from "@/components/Header";
import { getSignedUrl } from "@/utils/AWS";

const ProjectsPage = () => {
  const router = useRouter();
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const { data: projects, isLoading } = useGetProjectsQuery();

  // Handle navigation to project details
  const handleViewDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!projects) {
    return <div>No projects found.</div>;
  }

  return (
    <div className="p-8">
      <ProjectModal
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      {/* Header Section with "Projects" title and "New Project" button */}
      <div className="flex justify-between items-center mb-6">
        <Header
          name="Projects"
          buttonComponent={
            <Button
              onClick={() => setIsModalNewProjectOpen(true)}
              className="bg-black text-white hover:bg-gray-900" // Black button
            >
              <Plus className="mr-2 h-4 w-4" /> {/* Add icon */}
              New Project
            </Button>
          }
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            {/* Project Image */}
            {/* {project.image && ( */}
            <div className="w-full h-32 overflow-hidden rounded-t-lg">
              {" "}
              {/* Reduced image height */}
              {project.attachments && project.attachments.length > 0 && (
                <Image
                  src={decodeURIComponent(
                    getSignedUrl(project.attachments[0].fileURL) || "/i1.jpg"
                  )}
                  alt={project.attachments[0].fileName}
                  width={400}
                  height={200}
                  className="h-auto w-full rounded-t-md"
                />
              )}
              {/* <img
                src={
                  getSignedUrl(project?.attachments?.[0]?.fileURL) || "/i1.jpg"
                }
                alt={project.name}
                className="w-full h-full object-cover"
              /> */}
            </div>
            {/* )} */}

            <CardHeader className="p-4">
              {" "}
              {/* Reduced padding */}
              <CardTitle className="text-md font-semibold">
                {" "}
                {/* Smaller font size */}
                {project.name}
              </CardTitle>
              {project.description && (
                <CardDescription className="text-xs">
                  {" "}
                  {/* Smaller font size */}
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-4">
              {" "}
              {/* Reduced padding */}
              {/* Task-related labels with icons */}
              <div className="space-y-2">
                {" "}
                {/* Reduced spacing */}
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600">
                    {" "}
                    {/* Smaller font size */}
                    Total Tasks: {project.totalNumberOfTasks}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-gray-600">
                    {" "}
                    {/* Smaller font size */}
                    In Progress: {project.totalNumberOfInProgressTasks}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">
                    {" "}
                    {/* Smaller font size */}
                    Completed: {project.totalNumberOfCompletedTasks}
                  </span>
                </div>
              </div>
              {/* Display start and end dates with icons */}
              <div className="mt-3 space-y-1">
                {" "}
                {/* Reduced spacing */}
                {project.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-600">
                      {" "}
                      {/* Smaller font size */}
                      Start Date:{" "}
                      {formatDate(new Date(project.startDate), "yyyy-MM-dd")}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-600">
                      {" "}
                      {/* Smaller font size */}
                      End Date:{" "}
                      {formatDate(new Date(project.endDate), "yyyy-MM-dd")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-end">
              {" "}
              {/* Reduced padding */}
              <Button
                onClick={() => handleViewDetails(project.id)}
                className="bg-black text-white hover:bg-gray-900"
                size="sm" // Smaller button
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
