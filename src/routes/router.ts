import { Router } from "express";
import { CreateUser } from "../controllers/auth.controller";
import { upload } from "../middleware/multer.middleware";


const router = Router();

router.post("/register",
    upload.single("avatar"),
    CreateUser
)

export default router;