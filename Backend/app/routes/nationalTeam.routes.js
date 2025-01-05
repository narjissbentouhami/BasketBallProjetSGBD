module.exports = app => {
    const nationalTeams = require("../controllers/nationalteam.controller.js");

    var router = require("express").Router();

    // Create a new NationalTeam
    router.post("/", nationalTeams.create);

    // Retrieve all NationalTeams
    router.get("/", nationalTeams.findAll);

    // Retrieve a single NationalTeam with id
    router.get("/:id", nationalTeams.findOne);

    // Update a NationalTeam with id
    router.put("/:id", nationalTeams.update);

    // Delete a NationalTeam with id
    router.delete("/:id", nationalTeams.delete);

    // Delete all NationalTeams
    router.delete("/", nationalTeams.deleteAll);

    app.use('/api/nationalTeams', router);
}