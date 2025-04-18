import { Router } from "express";
import {
  createTaskChecklist,
  getTaskCheckLists,
  updateTaskChecklist,
} from "../controllers/taskCheckListController";

const router = Router();

router.get("/:taskId", getTaskCheckLists);
router.post("/", createTaskChecklist);
router.put("/:checklistId", updateTaskChecklist);

export default router;
