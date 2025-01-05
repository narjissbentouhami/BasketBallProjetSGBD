const db = require("../models");
const Club = db.club;
const Op = db.Sequelize.Op;

const { sequelize } = db;

exports.getClubsWithMostEuroleagueWins = async (req, res) => {
    console.log("Fetching clubs with most Euroleague wins");
  try {
    const query = `
      SELECT 
        c.id AS club_id, 
        c.name AS club_name, 
        COUNT(*) AS win_count
      FROM games g
      JOIN clubs c ON g.winner_id = c.id
      JOIN leagues l ON g.league_id = l.id
      WHERE l.name LIKE '%Euroleague%'
      GROUP BY c.id, c.name
      HAVING win_count > 2
      ORDER BY win_count DESC;
    `;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(404).send({ message: "No clubs found with more than three Euroleague wins." });
    }

    res.status(200).send(results);
  } catch (error) {
    console.error("Error fetching Euroleague winners:", error);
    res.status(500).send({ message: "An error occurred while fetching Euroleague winners." });
  }
};

exports.getClubsByLeague = async (req, res) => {
    console.log("Route hit for getClubsByLeague");
    console.log("Request URL:", req.url);
    console.log("Request Params:", req.params);

    try {
        const leagueId = req.params.id; // Use 'id' instead of 'leagueId'
        console.log("League ID:", leagueId);

        if (!leagueId) {
            return res.status(400).json({ message: "League ID is required" });
        }

        const query = `
            SELECT DISTINCT
                c.id AS clubId,
                c.name AS clubName,
                l.id AS leagueId,
                l.name AS leagueName
            FROM
                clubs c
            JOIN 
                games g ON (g.club_one_id = c.id OR g.club_two_id = c.id)
            JOIN 
                leagues l ON g.league_id = l.id
            WHERE 
                l.id = :leagueId;
        `;

        const clubs = await db.sequelize.query(query, {
            replacements: { leagueId },
            type: db.Sequelize.QueryTypes.SELECT,
        });

        res.status(200).json(clubs);
    } catch (error) {
        console.error("Error fetching clubs by league:", error);
        res.status(500).json({ message: "An error occurred while fetching clubs by league." });
    }
};





exports.getClubWithHighestAverageHeight = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id AS club_id,
                c.name AS club_name,
                AVG(p.height) AS average_height
            FROM 
                players AS p
            JOIN 
                clubs AS c ON p.club_id = c.id
            GROUP BY 
                c.id, c.name
            ORDER BY 
                average_height DESC
            LIMIT 1;
        `;

        const result = await sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT });

        if (result.length > 0) {
            res.status(200).json(result[0]); // Return the top club
        } else {
            res.status(404).json({ message: "No club data found." });
        }
    } catch (error) {
        console.error("Error fetching club with highest average height:", error);
        res.status(500).json({ message: "An error occurred while fetching the club data." });
    }
};


// Create and Save a new Club
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Club
    const club = {
        name: req.body.name,
        city: req.body.city,
        sponsor_id: req.body.sponsor_id,
    };

    // Save Club in the database
    Club.create(club)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Club."
            });
        });
};

// Retrieve all Clubs from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;

    Club.findAll({
            where: condition
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving clubs."
            });
        });
};

// Find a single Club with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Club.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Club with id=" + id
            });
        });
};

// Update a Club by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Club.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Club was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Club with id=${id}. Maybe Club was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Club with id=" + id
            });
        });
};

// Delete a Club with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Club.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Club was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Club with id=${id}. Maybe Club was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Club with id=" + id
            });
        });
};

// Delete all Clubs from the database.
exports.deleteAll = (req, res) => {
    Club.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Clubs were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all clubs."
            });
        });
};

// Find all players by club
exports.findAllp = (req, res) => {
    const id = req.params.id;

    Club.findByPk(id, {
            include: ["players"]
        })
        .then(data => {
            res.send(data.players);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Club with id=" + id
            });
        });
};
