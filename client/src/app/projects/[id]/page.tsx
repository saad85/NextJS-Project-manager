"use client";

import { useState } from "react";
import ProjectHeader from "../ProjectHeader";
import Board from "../Board";
import List from "../List";
import Timeline from "../Timeline";
import { useGetProjectByIdQuery } from "@/state/api";
import Table from "../Table";
import ModalNewTask from "@/components/ModalNewTask";
import { Loader2 } from "lucide-react";

type Props = {
  params: {
    id: string;
  };
};

const Project = ({ params }: Props) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const { data: project, isLoading } = useGetProjectByIdQuery({
<<<<<<< HEAD
    id: id,
=======
    id: Number(id),
>>>>>>> 3d04d232cd4890ac617b97b18b5a32c0cc13eff8
  });
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }
  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
      <ProjectHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        name={project?.name}
      />
      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "List" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Timeline" && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;
