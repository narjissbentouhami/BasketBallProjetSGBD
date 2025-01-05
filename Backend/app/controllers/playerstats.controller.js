const db = require("../models");
const PlayerStats = db.playerStats;
const Op = db.Sequelize.Op;
const { sequelize } = db;

exports.getTopAssistPlayerByClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (!clubId) {
      return res.status(400).json({ message: "Club ID is required." });
    }

    const query = `
      SELECT 
          p.id AS player_id,
          p.name AS player_name,
          c.id AS club_id,
          c.name AS club_name,
          AVG(ps.assists) AS avg_assists_per_game
      FROM 
          players p
      JOIN 
          playerstats ps ON p.id = ps.player_id
      JOIN 
          clubs c ON p.club_id = c.id
      WHERE 
          c.id = :clubId
      GROUP BY 
          p.id, c.id
      ORDER BY 
          avg_assists_per_game DESC
      LIMIT 1;
    `;

    const topPlayer = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { clubId },
    });

    if (topPlayer.length === 0) {
      return res.status(404).json({ message: "No players found for this club." });
    }

    return res.status(200).json(topPlayer[0]);
  } catch (error) {
    console.error("Error fetching top assist player:", error);
    return res.status(500).json({ message: "An error occurred while fetching the top assist player." });
  }
};


exports.getTopThreePointPlayersByClub = async (req, res) => {
  try {
    const query = `
      SELECT 
          p.id AS player_id,
          p.name AS player_name,
          p.club_id,
          c.name AS club_name,
          ps.success_percentage AS three_point_percentage
      FROM 
          players p
      JOIN 
          playerstats ps ON p.id = ps.player_id
      JOIN 
          clubs c ON p.club_id = c.id
      WHERE 
          ps.success_percentage = (
              SELECT MAX(ps2.success_percentage)
              FROM playerstats ps2
              JOIN players p2 ON ps2.player_id = p2.id
              WHERE p2.club_id = p.club_id
          )
      ORDER BY 
          c.name ASC, three_point_percentage DESC;
    `;

    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching top 3-point players by club:", error);
    return res.status(500).json({
      message: "An error occurred while fetching data.",
    });
  }
};


exports.getTopFreeThrowPlayersInFinal = async (req, res) => {
    try {
      const championshipId = 4;
  
      if (!championshipId) {
        return res.status(400).json({ message: "Championship ID is required." });
      }
  
      const query = `
        SELECT 
            p.id AS player_id,
            p.name AS player_name,
            ps.free_throws AS free_throws_made,
            ps.success_percentage AS free_throw_percentage,
            g.id AS game_id,
            g.type AS game_type,
            c.id AS championship_id,
            c.name AS championship_name
        FROM 
            players p
        JOIN 
            playerstats ps ON p.id = ps.player_id
        JOIN 
            games g ON ps.game_id = g.id
        JOIN 
            championships c ON g.championship_id = c.id
        WHERE 
            c.id = :championshipId
        ORDER BY 
            ps.success_percentage DESC
        LIMIT 3;
      `;
  
      const topPlayers = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { championshipId }, // Replacing :championshipId with the provided parameter
      });
  
      if (topPlayers.length === 0) {
        return res.status(404).json({ message: "No players found for this championship final." });
      }
  
      return res.status(200).json(topPlayers);
    } catch (error) {
      console.error("Error fetching top players:", error);
      return res.status(500).json({ message: "An error occurred while fetching top players." });
    }
  };

// exports.getTopPlayersByNationalTeam = async (req, res) => {
//     try {
//         // Fetch all national teams
//         const nationalTeams = await NationalTeam.findAll();

//         const results = await Promise.all(
//             nationalTeams.map(async (team) => {
//                 // Fetch top 2 players for this national team
//                 const topPlayers = await Player.findAll({
//                     where: { nationalTeam_id: team.id },
//                     include: [
//                         {
//                             model: PlayerStats,
//                             include: [
//                                 {
//                                     model: Game,
//                                     where: { type: "Championship" }, // Only consider Championship games
//                                 },
//                             ],
//                         },
//                     ],
//                     attributes: {
//                         include: [
//                             [
//                                 db.sequelize.fn(
//                                     "AVG",
//                                     db.sequelize.col("playerStats.success_percentage")
//                                 ),
//                                 "avg_success_percentage",
//                             ],
//                         ],
//                     },
//                     group: ["Player.id", "PlayerStats.id", "PlayerStats->Game.id"],
//                     order: [[db.sequelize.literal("avg_success_percentage"), "DESC"]],
//                     limit: 2, // Fetch only top 2 players
//                 });

//                 return {
//                     nationalTeam: team.name,
//                     topPlayers: topPlayers.map((player) => ({
//                         id: player.id,
//                         name: player.name,
//                         avgSuccessPercentage: player.dataValues.avg_success_percentage,
//                     })),
//                 };
//             })
//         );

//         res.status(200).send(results);
//     } catch (err) {
//         console.error("Error fetching top players:", err);
//         res.status(500).send({
//             message: err.message || "An error occurred while fetching top players.",
//         });
//     }
// };

// exports.getTopPlayersByNationalTeam = async (req, res) => {
//     try {
//         const query = `
//             SELECT 
//                 p.id, 
//                 p.name, 
//                 p.nationalTeam_id, 
//                 nt.name AS nationalTeamName, 
//                 AVG(ps.success_percentage) AS avgSuccessPercentage
//             FROM 
//                 players AS p
//             JOIN 
//                 playerstats AS ps ON p.id = ps.player_id
//             JOIN 
//                 games AS g ON ps.game_id = g.id
//             JOIN 
//                 nationalteams AS nt ON p.nationalTeam_id = nt.id
//             WHERE 
//                 g.type = 'Championship'
//             GROUP BY 
//                 p.id, p.nationalTeam_id, nt.name
//             ORDER BY 
//                 avgSuccessPercentage DESC
//             LIMIT 2;
//         `;

//         const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
//         console.log("Query results:", results); // Debugging log
//         res.status(200).json(results);
//     } catch (error) {
//         console.error("Error executing raw query:", error);
//         res.status(500).send({ message: "Failed to fetch top players." });
//     }
// };
exports.getTopPlayersByNationalTeam = async (req, res) => {
    console.log("Route hit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"); // Log when the route is called
    try {
        const query = `
            SELECT p.id, p.name, p.nationalTeam_id, nt.name AS nationalTeamName,
                   AVG(ps.success_percentage) AS avgSuccessPercentage
            FROM players AS p
            JOIN playerstats AS ps ON p.id = ps.player_id
            JOIN games AS g ON ps.game_id = g.id
            JOIN nationalteams AS nt ON p.nationalTeam_id = nt.id
            WHERE g.type = 'Championship'
            GROUP BY p.id, p.nationalTeam_id, nt.name
            ORDER BY avgSuccessPercentage DESC
            LIMIT 2;
        `;
        console.log("Query:", query);
        const topPlayers = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        console.log("Top Players:", topPlayers);
        res.status(200).json(topPlayers);
    } catch (error) {
        console.error("Error fetching top players:", error);
        res.status(500).json({ message: "An error occurred while fetching top players." });
    }
};



// Create and Save a new PlayerStats
exports.create = (req, res) => {
    try {
        const playerstats = {
            game_id: req.body.game_id,
            player_id: req.body.player_id,
            points_3: req.body.points_3,
            points_2: req.body.points_2,
            free_throws: req.body.free_throws,
            success_percentage: req.body.success_percentage,
            assists: req.body.assists,
            rebounds: req.body.rebounds,
            blocks: req.body.blocks,
            fouls: req.body.fouls,
        };

        PlayerStats.create(playerstats)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                console.error("Error details:", err); // Log the error for debugging
                res.status(500).send({
                    message:
                        err.message || "Une erreur s'est produite lors de la création de PlayerStats.",
                });
            });
    } catch (err) {
        console.error("Unexpected error details:", err); // Log unexpected errors
        res.status(500).send({
            message: "Une erreur inattendue s'est produite.",
        });
    }
};


// Retrieve all PlayerStats from the database.
exports.findAll = (req, res) => {
    const minutes_played = req.query.minutes_played;
    var condition = minutes_played ? {
        minutes_played: {
            [Op.like]: `%${minutes_played}%`
        }
    } : null;

    PlayerStats.findAll({
            where: condition
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving playerstats."
            });
        });
}

// Find a single PlayerStats with an id
// exports.findOne = (req, res) => {
//     const id = req.params.id;

//     PlayerStats.findByPk(id)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error retrieving PlayerStats with id=" + id
//             });
//         });
// }
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const playerStat = await PlayerStats.findByPk(id);
        if (!playerStat) {
            return res.status(404).send({ message: `No PlayerStats found with id=${id}` });
        }
        res.status(200).json(playerStat);
    } catch (error) {
        console.error("Error fetching PlayerStats by ID:", error);
        res.status(500).send({ message: "An error occurred while retrieving the PlayerStats." });
    }
};

// Update a PlayerStats by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    PlayerStats.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "PlayerStats was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update PlayerStats with id=${id}. Maybe PlayerStats was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating PlayerStats with id=" + id
            });
        });
}

// Delete a PlayerStats with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    PlayerStats.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "PlayerStats was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete PlayerStats with id=${id}. Maybe PlayerStats was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete PlayerStats with id=" + id
            });
        });
}

// Delete all PlayerStats from the database.
exports.deleteAll = (req, res) => {
    PlayerStats.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} PlayerStats were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all playerstats."
            });
        });
}

