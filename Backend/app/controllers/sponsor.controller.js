const db = require("../models");
const Sponsor = db.sponsor;
const Op = db.Sequelize.Op;

const { sequelize } = db;

exports.getTopSponsorForChampionship = async (req, res) => {
  try {
    const championshipId = req.params.championshipId;

    if (!championshipId) {
      return res.status(400).send({ message: "Championship ID is required." });
    }

    const query = `
      SELECT 
          s.id AS sponsor_id,
          s.name AS sponsor_name,
          COUNT(nt.id) AS national_teams_won
      FROM 
          sponsors s
      JOIN 
          nationalteams nt ON s.id = nt.sponsor_id
      JOIN 
          games g ON g.winner_id = nt.id
      WHERE 
          g.type = 'Championship'
          AND g.championship_id = :championshipId
      GROUP BY 
          s.id, s.name
      ORDER BY 
          national_teams_won DESC
      LIMIT 1;
    `;

    const topSponsor = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { championshipId },
    });

    if (topSponsor.length === 0) {
      return res.status(404).send({ message: "No sponsor found for this championship." });
    }

    res.status(200).send(topSponsor[0]);
  } catch (error) {
    console.error("Error fetching top sponsor:", error);
    res.status(500).send({
      message: "An error occurred while retrieving the top sponsor.",
    });
  }
};

// Create and Save a new Sponsor
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Sponsor
    const sponsor = {
        name: req.body.name,
    };

    // Save Sponsor in the database
    Sponsor.create(sponsor)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Sponsor."
            });
        });
};

// Retrieve all Sponsors from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;

    Sponsor.findAll({
            where: condition
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving sponsors."
            });
        });
};

// Find a single Sponsor with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Sponsor.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Sponsor with id=" + id
            });
        });
};

// Update a Sponsor by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Sponsor.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Sponsor was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Sponsor with id=${id}. Maybe Sponsor was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Sponsor with id=" + id
            });
        });
};

// Delete a Sponsor with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Sponsor.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Sponsor was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Sponsor with id=${id}. Maybe Sponsor was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Sponsor with id=" + id
            });
        });
};

// Delete all Sponsors from the database.
exports.deleteAll = (req, res) => {
    Sponsor.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Sponsors were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all sponsors."
            });
        });
};

// Find all sponsored clubs
exports.findAllClubs = (req, res) => {
    Sponsor.findAll({
            include: ["clubs"]
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

// Find all sponsored national teams
exports.findAllNationalTeams = (req, res) => {
    Sponsor.findAll({
            include: ["nationalTeams"]
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving national teams."
            });
        });
};

// Find all sponsored players
exports.findAllPlayers = (req, res) => {
    Sponsor.findAll({
            include: ["players"]
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

// Find all sponsored leagues
// exports.findAllLeagues = (req, res) => {
//     Sponsor.findAll({
//             include: ["leagues"]
//         })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving leagues."
//             });
//         });
// };

// Find all sponsored games
exports.findAllGames = (req, res) => {
    Sponsor.findAll({
            include: ["games"]
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving games."
            });
        });
};


