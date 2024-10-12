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
    middlewareRestrictor(10, 60, true),
    async (req, res) => {
        const code = req.params.code;
        const gum = await Gum.findById(code).exec();
        if (!gum) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            return;
        }
        res.send(gum);
    },
);

router.post("/",
    middlewareValidator.body("type").isIn([
        "plain", "js",
    ]),
    middlewareValidator.body("content").notEmpty(),
    middlewareInspector,
    async (req, res) => {
        const timestamp = utilNative.getPosixTimestamp();
        const gum = new Gum({
            type: req.body.type,
            content: req.body.content,
            author: req.auth?.id || null,
            created_at: timestamp,
            updated_at: timestamp,
        });
        try {
            await gum.save();
            res.status(StatusCodes.CREATED).send(gum);
        } catch (e) {
            console.error(e);
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },
);

// Export routes mapper (function)
module.exports = () => {
    // Use application
    const app = useApp();

    // Mount the router
    app.use("/gum", router);
};
