import { Router } from "express";
import { CreateUser, loginUser } from "../controllers/auth.controller";
import { upload } from "../middleware/multer.middleware";


const router = Router();

router.post("/register",
    upload.single("avatar"),
    CreateUser
)

router.post("/login", upload.none(), loginUser);
export default router;