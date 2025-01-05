module.exports = app => {
    const sponsors = require("../controllers/sponsor.controller.js");

    var router = require("express").Router();

    // Create a new Sponsor
    router.post("/", sponsors.create);

    // Retrieve all Sponsors
    router.get("/", sponsors.findAll);

    // Retrieve a single Sponsor with id
    router.get("/:id", sponsors.findOne);

    // Update a Sponsor with id
    router.put("/:id", sponsors.update);

    // Delete a Sponsor with id
    router.delete("/:id", sponsors.delete);

    // Delete all Sponsors
    router.delete("/", sponsors.deleteAll);

    router.get("/top-sponsor/:championshipId", sponsors.getTopSponsorForChampionship);

    app.use('/api/sponsors', router);
}