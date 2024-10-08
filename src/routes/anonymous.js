"use strict";

// Import modules
const {StatusCodes} = require("http-status-codes");
const {useApp, express} = require("../init/express");

const Gum = require("../models/gum");

const utilNative = require("../utils/native");

const middlewareInspector = require("../middleware/inspector");
const middlewareValidator = require("express-validator");
const middlewareRestrictor = require("../middleware/restrictor");

// Create router
const {Router: newRouter} = express;
const router = newRouter();

router.use(express.json());

router.get("/:code",
    middlewareValidator.param("code").isMongoId().notEmpty(),
    middlewareInspector,
    middlewareRestrictor(10, 60, false),
    async (req, res) => {
        const code = req.params.code;
        const gum = await Gum.findById(code).exec();
        if (!gum) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }
        res.send(gum);
    },
);

router.post("/",
    middlewareValidator.body("content").notEmpty(),
    middlewareInspector,
    async (req, res) => {
        const gum = new Gum();
        gum.content = req.body.content;
        gum.author = null;
        gum.created_at = utilNative.getPosixTimestamp();
        gum.updated_at = utilNative.getPosixTimestamp();
        await gum.save();
        res.status(StatusCodes.CREATED).send(gum);
    },
);

// Export routes mapper (function)
module.exports = () => {
    // Use application
    const app = useApp();

    // Mount the router
    app.use("/gum", router);
};
