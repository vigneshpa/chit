import { Router } from 'express';
import * as multer from "multer";
import { readFileSync } from 'fs';
import { compare } from "bcrypt";
const users: { [user: string]: string } = JSON.parse((readFileSync("users.json")).toString());
const upload = multer();
const router = Router();

router.post("/login", upload.none(), async function (req, res, next) {
  if (req.session.user?.loggedIn) {
    next();
    return;
  }

  if (users.hasOwnProperty(req.body.user) && (await compare(req.body.pwd, users[req.body.user]))) {
    req.session.user = {
      loggedIn: true,
      name: req.body.user
    };
    res.status(200).json("LOGGED_IN");
  } else {
    res.status(401).json("LOGIN_FAILED");
  }

});
router.use(function auth(req, res, next) {
  if (req.session.user?.loggedIn) {
    next();
    return;
  }
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
