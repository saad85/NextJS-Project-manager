import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
} from "@/controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
