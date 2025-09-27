import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, 'public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
})

export const upload = multer({ storage });