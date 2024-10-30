"use strict";

// Import modules
const {StatusCodes} = require("http-status-codes");
const {useApp, withAwait, express} = require("../init/express");

const Gum = require("../models/gum");

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
    middlewareRestrictor(10, 60, true, StatusCodes.NOT_FOUND),
    withAwait(async (req, res) => {
        // Extract code
        const {code} = req.params;

        // Find gum
        const gum = await Gum.findById(code).exec();

        // Check if gum not found
        if (!gum) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        // Send Response
        res.send(gum);
    }),
);

router.post("/",
    middlewareValidator.body("type").isIn([
        "plain", "js",
    ]),
    middlewareValidator.body("content").notEmpty(),
    middlewareInspector,
    withAwait(async (req, res) => {
        // Extract params
        const {type, content} = req.body;
        const author = req.auth?.id || null;

        // Prepare gum
        const gum = new Gum({
            type, content, author,
        });

        // Save gum
        await gum.save();

        // Send Response
        res.
            status(StatusCodes.CREATED).
            send(gum);
    }),
);

// Export routes mapper (function)
module.exports = () => {
    // Use application
    const app = useApp();

    // Mount the router
    app.use("/gums", router);
};
