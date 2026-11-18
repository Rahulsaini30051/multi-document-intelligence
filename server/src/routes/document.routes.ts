
import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import {
  uploadDocuments,
  listDocuments,
  getDocumentText,
} from "../controllers/document.controller.js";

const router = Router();

router.post(
  "/upload",
  upload.array("documents", 10),
  uploadDocuments
);

router.get("/", listDocuments);
router.get("/:id/text", getDocumentText);

export default router;
