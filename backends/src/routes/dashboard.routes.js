const router = require("express").Router();
const { getDashboardData } = require("../controllers/dashboard.controller");

router.get("/", getDashboardData);
module.exports = router;
