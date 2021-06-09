import { Router } from 'express';
import * as multer from "multer";


const upload = multer();
const router = Router();

function authenticate(user: string, pass: string) {

  // User Authentication code goes here

  return true;
}




router.post("/login", upload.none(), async function (req, res, next) {
  if (req.session.user?.loggedIn) return next();
  if (!req.body.user || typeof req.body.user !== "string") return next();
  if (!req.body.pwd || typeof req.body.pwd !== "string") return next();
  if (authenticate(req.body.user, req.body.pwd)) {
    req.session.user = {
      loggedIn: true,
      name: req.body.user
    };
    res.status(200).json("LOGGED_IN");
  } else {
    res.status(401).json("LOGIN_FAILED");
  }

});
router.use((req, res, next) => {
  if (req.session.user?.loggedIn) return next();
  res.status(401).render("error", { code: 401, title: "Forbidden!", message: "You are not allowed here." });
});

router.get("/login", (req, res, next) => res.status(200).json("LOGGED_IN"));

router.get("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect(303, "/");
  });
});

router.use((req, res, next) => next());
export default router;