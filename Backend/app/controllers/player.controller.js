const db = require("../models");
const Player = db.player;
const PlayerStats = db.playerstats;
const Club = db.club;
const Op = db.Sequelize.Op;

const { sequelize } = db;

exports.getPlayersByLeague = async (req, res) => {
    const { leagueId } = req.params; // Extract leagueId from route parameter

    if (!leagueId) {
        return res.status(400).json({ message: "League ID is required." });
    }

    try {
        const query = `
            SELECT 
                p.id AS playerId,
                p.name AS playerName,
                c.id AS clubId,
                c.name AS clubName,
                g.id AS gameId,
                g.league_id AS leagueId,
                l.name AS leagueName
            FROM 
                players p
            JOIN 
                clubs c ON p.club_id = c.id
            JOIN 
                games g ON (g.club_one_id = c.id OR g.club_two_id = c.id)
            JOIN 
                leagues l ON g.league_id = l.id
            WHERE 
                l.id = :leagueId
            LIMIT 25;
        `;

        const players = await sequelize.query(query, {
            replacements: { leagueId },
            type: sequelize.QueryTypes.SELECT
        });

        if (!players.length) {
            return res.status(404).json({ message: "No players found for the specified league." });
        }

        res.status(200).json(players);
    } catch (error) {
        console.error("Error fetching players by league:", error);
        res.status(500).json({ message: "An error occurred while fetching players." });
    }
};

// Retrieve all Players with their Clubs
exports.findAllPlayersp = async (req, res) => {
    try {
      const players = await Player.findAll({
        include: [
          {
            model: Club,
            as: "club", // Match the alias in the association
            attributes: ["name"], // Only include the club name
          },
        ],
      });
      res.status(200).send(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).send({ message: "Error fetching players." });
    }
  };

// Create and Save a new Player
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Player
    const player = {
        name: req.body.name,
        birth_date: req.body.birth_date,
        height: req.body.height,
        citizenship: req.body.citizenship,
        club_id: req.body.club_id,
        nationalteam_id: req.body.nationalteam_id,
    };

    // Save Player in the database
    Player.create(player)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Player."
            });
        });
};

// Retrieve all Players from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;

    Player.findAll({
            where: condition
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving players."
            });
        });
};

// Find a single Player with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Player.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Player with id=" + id
            });
        });
};

// Update a Player by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Player.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Player was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Player with id=${id}. Maybe Player was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Player with id=" + id
            });
        });
};

// Delete a Player with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Player.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Player was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Player with id=${id}. Maybe Player was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Player with id=" + id
            });
        });
};

// Delete all Players from the database.
exports.deleteAll = (req, res) => {
    Player.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Players were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all players."
            });
        });
};

//get player stats
exports.getPlayerStats = (req, res) => {
    const id = req.params.id;

    PlayerStats.findAll({
            where: {
                player_id: id
            }
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Player with id=" + id
            });
        });
};

//update player club_id 
exports.updateClub = (req, res) => {
    const id = req.params.id;

    Player.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Player was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Player with id=${id}. Maybe Player was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Player with id=" + id
            });
        });
};

//update player nationalteam_id
exports.updateNationalTeam = (req, res) => {
    const id = req.params.id;

    Player.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Player was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Player with id=${id}. Maybe Player was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Player with id=" + id
            });
        });
};
