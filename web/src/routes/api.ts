import { Router } from 'express';
import * as multer from "multer";
const upload = multer();
const router = Router();

router.post("/login",upload.none(),  function(req, res, next){
  if(req.session.user?.loggedIn){
    next();
    return;
  }

  if(req.body.user === "admin" && req.body.pwd === "admin"){
    req.session.user = {
      loggedIn:true,
      name:"Administrator"
    };
    res.type('json').status(200).send(JSON.stringify("LOGGED_IN"));
  }else{
    res.type('json').status(401).send(JSON.stringify("LOGIN_FAILED"));
  }

});
router.use(function auth(req, res, next){
  if(req.session.user?.loggedIn){
    next();
    return;
  }
  res.status(401).render("error", {code:401, title:"Forbidden!", message:"You are not allowed here."});
});

router.get("/logout", function(req, res, next){
  req.session.destroy((err)=>{
    if(err)throw err;
    res.type('json').status(200).send(JSON.stringify("LOGGED_OUT"));
  });
});


router.use((req, res, next)=>next());

export default router;
