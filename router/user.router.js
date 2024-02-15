import { Router } from "express";
import { userLogin, userQuestions, userRegister,userAnswers,userLogout } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();


router.route("/register").get((req, res) => {
    res.render("register",{user: req.user});
}).post(upload.single('profilePicture'),userRegister);

router.route("/login").get((req, res) => {
    res.render("login",{user: req.user});
}).post(userLogin);

router.route("/question").post(verifyToken,userQuestions);
router.route("/answer").post(verifyToken,userAnswers);
router.route("/logout").get(userLogout)

export default router;
