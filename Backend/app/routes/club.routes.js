module.exports = app => {
    const clubs = require("../controllers/club.controller.js");

    var router = require("express").Router();

    // Create a new Club
    router.post("/", clubs.create);

    // Retrieve all Clubs
    router.get("/", clubs.findAll);
    router.get("/most-euroleague-wins", clubs.getClubsWithMostEuroleagueWins);


    router.get("/highest-average-height", clubs.getClubWithHighestAverageHeight);
    router.get("/by-league/:id", clubs.getClubsByLeague);
    // Retrieve a single Club with id
    router.get("/:id", clubs.findOne);

    // Update a Club with id
    router.put("/:id", clubs.update);

    // Delete a Club with id
    router.delete("/:id", clubs.delete);

    //getClubsByLeague
    

    // Delete all Clubs
    router.delete("/", clubs.deleteAll);

    //Find all players by club
    router.get("/clubplayers/:id", clubs.findAllp);


    app.use('/api/clubs', router);
}