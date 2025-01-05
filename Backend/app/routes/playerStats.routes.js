module.exports = app => {
    const playerStats = require("../controllers/playerstats.controller.js");
    const playerStatsController = require("../controllers/playerstats.controller.js");

    var router = require("express").Router();

    // Create a new PlayerStat
    router.post("/", playerStats.create);

    router.get("/top-three-points-by-club", playerStats.getTopThreePointPlayersByClub);

    // Retrieve all PlayerStats
    router.get("/", playerStats.findAll);
    router.get("/top-players", playerStatsController.getTopPlayersByNationalTeam);

    // Retrieve a single PlayerStat with id
    router.get("/:id", playerStats.findOne);

    // Update a PlayerStat with id
    router.put("/:id", playerStats.update);

    // Delete a PlayerStat with id
    router.delete("/:id", playerStats.delete);

    // Delete all PlayerStats
    router.delete("/", playerStats.deleteAll);

    router.get("/top-assist-player/:clubId", playerStats.getTopAssistPlayerByClub);

    //getTopFreeThrowPlayersInFinal
    router.get(
        "/top-free-throws/:championshipId",
        playerStats.getTopFreeThrowPlayersInFinal
      );
    
      

    app.use('/api/playerStats', router);
}