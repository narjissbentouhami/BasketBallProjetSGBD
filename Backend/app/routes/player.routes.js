module.exports = app => {
    const players = require("../controllers/player.controller.js");

    var router = require("express").Router();

    // Create a new Player
    router.post("/", players.create);

    // Retrieve all Players
    router.get("/", players.findAll);

    //getPlayersByLeague
    router.get("/by-league/:id", players.getPlayersByLeague);
    

    // Retrieve a single Player with id
    router.get("/:id", players.findOne);

    // Update a Player with id
    router.put("/:id", players.update);

    // Delete a Player with id
    router.delete("/:id", players.delete);

    // Delete all Players
    router.delete("/", players.deleteAll);

    // Update Club
    router.put("/updateClub/:id", players.updateClub);

    //Update NationalTeam
    router.put("/updateNationalTeam/:id", players.updateNationalTeam);

    //find allplayers by club
    router.get("/playerclub/", players.findAllPlayersp);

    app.use('/api/players', router);
}