const express = require("express");
const router = express.Router();
const controller = require("../Controllers/itensControllers");

router.get("/", controller.getItens);
router.get("/:id", controller.getItensId);

router.put("/:id", controller.atualizarItens);
router.put("/:id/:status", controller.atualizarStatus);

router.post("/", controller.postItens);

router.delete("/:id", controller.deleteItens);

module.exports = router;