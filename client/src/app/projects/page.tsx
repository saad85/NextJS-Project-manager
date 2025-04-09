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
import { useGetProjectsQuery, useDeleteProjectMutation } from "@/state/api";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Calendar,
  CalendarCheck,
  Plus,
  MoreVertical,
  Trash,
  Briefcase,
} from "lucide-react";
import ProjectModal from "./ProjectModal";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getSignedUrl } from "@/utils/AWS";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/DeleteModal";
import { useAppSelector } from "../reduxStoreProvider";

const ProjectsPage = () => {
  const router = useRouter();
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { data: projects, isLoading, refetch } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleViewDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject({ id: projectToDelete }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setProjectToDelete(null);
    }
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

      <DeleteModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete this project? All related tasks and data will be permanently removed."
      />

      <div className="flex justify-between items-center mb-6 pb-4">
        <Header
          name="Projects"
          buttonComponent={
            <Button
              onClick={() => setIsModalNewProjectOpen(true)}
              className="bg-black text-white hover:bg-gray-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-lg transition-shadow relative"
          >
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={() => setProjectToDelete(project.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="w-full h-32 overflow-hidden rounded-t-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {project.attachments && project.attachments.length > 0 ? (
                <Image
                  src={
                    getSignedUrl(project.attachments[0].fileURL) || "/i1.jpg"
                  }
                  alt={project.attachments[0].fileName}
                  width={400}
                  height={200}
                  className="h-auto w-full rounded-t-md object-cover"
                />
              ) : (
                // Fallback: default briefcase icon
                <Briefcase className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <CardHeader className="p-4">
              <CardTitle className="text-md font-semibold">
                {project.name}
              </CardTitle>
              {project.description && (
                <CardDescription className="text-xs">
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="p-4">
              {/* ... rest of your card content ... */}
            </CardContent>

            <CardFooter className="p-4 flex justify-end">
              <Button
                onClick={() => handleViewDetails(project.id)}
                className="bg-black text-white hover:bg-gray-900"
                size="sm"
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
