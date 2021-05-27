import { Router } from 'express';
import * as multer from "multer";
import { readFileSync } from 'fs';
import { compare } from "bcrypt";
import { graphqlHTTP } from "express-graphql";
import { buildSchema, graphql } from "graphql";
import Resolver from "../graphql/resolver";


const users: { [user: string]: string } = JSON.parse((readFileSync("users.json")).toString());
const schemastr = readFileSync(__dirname + "/../graphql/schema.gql").toString();
const upload = multer();
const router = Router();

router.post("/login", upload.none(), async function (req, res, next) {
  if (req.session.user?.loggedIn) {
    next();
    return;
  }

  if (users.hasOwnProperty(req.body.user) && (await compare(req.body.pwd, users[req.body.user]))) {
    if(!req.body.user||typeof req.body.user !=="string")return console.log("Login error: logged in user is falsy or not string");
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

const schema = buildSchema(schemastr);
router.use("/graphql", (req, res, next) => {
  if(!req.session.user?.name)return;
  const resolver = new Resolver(req.session.user.name);
  const gql = graphqlHTTP({ schema, graphiql: true, rootValue: resolver.root });
  try {
    gql(req, res);
  } catch (e) {
    next(e);
  }
});





router.use((req, res, next) => next());
export default router;