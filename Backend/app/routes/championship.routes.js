module.exports = app => {
    const championships = require("../controllers/championship.controller.js");

    var router = require("express").Router();

    // Create a new Championship
    router.post("/", championships.create);

    // Retrieve all Championships
    router.get("/", championships.findAll);

    router.get("/national-teams/:id", championships.getNationalTeamsByChampionship);

    // Retrieve a single Championship with id
    router.get("/:id", championships.findOne);

    // Update a Championship with id
    router.put("/:id", championships.update);

    // Delete a Championship with id
    router.delete("/:id", championships.delete);

    // Delete all Championships
    router.delete("/", championships.deleteAll);

    app.use('/api/championships', router);
}
