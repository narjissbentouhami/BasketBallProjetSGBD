module.exports = app => {
    const leagues = require("../controllers/league.controller.js");

    var router = require("express").Router();

    // Create a new League
    router.post("/", leagues.create);

    // Retrieve all Leagues
    router.get("/", leagues.findAll);

    // Retrieve a single League with id
    router.get("/:id", leagues.findOne);

    // Update a League with id
    router.put("/:id", leagues.update);

    // Delete a League with id
    router.delete("/:id", leagues.delete);

    // Delete all Leagues
    router.delete("/", leagues.deleteAll);

    app.use('/api/leagues', router);
}