"use strict";

const {StatusCodes} = require("http-status-codes");
const {Router: expressRouter} = require("express");

// Import modules
const schema = {
    gum: require("../schemas/gum"),
};
const middleware = {
    inspector: require("../middleware/inspector"),
    validator: require("express-validator"),
};

// Export routes mapper (function)
module.exports = (ctx, r) => {
    const router = expressRouter();

    router.get("/:code",
        middleware.validator.param("code").isMongoId().notEmpty(),
        middleware.inspector,
        async (req, res) => {
            const code = req.params.code;
            const Gum = ctx.database.model("Gum", schema.gum);
            const gum = await Gum.findById(code).exec();
            if (!gum) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            res.send(gum);
        },
    );

    router.post("/",
        middleware.validator.body("content").notEmpty(),
        middleware.inspector,
        async (req, res) => {
            const Gum = ctx.database.model("Gum", schema.gum);
            const gum = new Gum(req.body);
            gum.author = null;
            gum.created_at = ctx.now();
            gum.updated_at = ctx.now();
            await gum.save();
            res.status(StatusCodes.CREATED).send(gum);
        },
    );

    r.use("/anonymous", router);
};
