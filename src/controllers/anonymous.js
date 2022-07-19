"use strict";

const {StatusCodes} = require("http-status-codes");
const {Router: expressRouter} = require("express");

// Import modules
const schema = {
    chew: require("../schemas/chew"),
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
            const Chew = ctx.database.model("Chew", schema.chew);
            const chew = await Chew.findById(code).exec();
            if (!chew) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            res.send(chew);
        },
    );

    router.post("/",
        middleware.validator.body("content").notEmpty(),
        middleware.inspector,
        async (req, res) => {
            const Chew = ctx.database.model("Chew", schema.chew);
            const chew = new Chew(req.body);
            chew.author = null;
            chew.created_at = ctx.now();
            chew.updated_at = ctx.now();
            await chew.save();
            res.send(chew);
        },
    );

    r.use("/anonymous", router);
};
