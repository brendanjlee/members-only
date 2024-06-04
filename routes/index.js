var express = require("express");
var router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

router.get("/", message_controller.index_get);

router.get("/newMessage", message_controller.message_create_get);

router.post("/newMessage", message_controller.message_create_post);

router.get("/sign-up", user_controller.sign_up_get);

router.post("/sign-up", user_controller.sign_up_post);

router.get("/login", user_controller.log_in_get);

router.post("/login", user_controller.log_in_post);

router.get("/logout", user_controller.sign_out_get);

module.exports = router;
