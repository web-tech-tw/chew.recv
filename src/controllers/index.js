"use strict";

const routes = [
    require("./anonymous"),
];

module.exports = (ctx, app) => {
    routes.forEach((c) => c(ctx, app));
};
