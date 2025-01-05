const db = require("../models");
const Championship = db.championship;
const Op = db.Sequelize.Op;
const { sequelize } = db;

exports.getNationalTeamsByChampionship = async (req, res) => {
    try {
        const championshipId = req.params.id;
        if (!championshipId) {
            return res.status(400).json({ message: "Championship ID is required." });
        }

        const query = `
            SELECT DISTINCT
                nt.id AS nationalTeamId,
                nt.name AS nationalTeamName,
                c.id AS championshipId,
                c.name AS championshipName
            FROM
                nationalteams nt
            JOIN 
                games g ON (g.nationalTeam_one_id = nt.id OR g.nationalTeam_two_id = nt.id)
            JOIN 
                championships c ON g.championship_id = c.id
            WHERE 
                c.id = :championshipId
            LIMIT 0, 25;
        `;

        const nationalTeams = await sequelize.query(query, {
            replacements: { championshipId },
            type: sequelize.QueryTypes.SELECT,
        });

        res.status(200).json(nationalTeams);
    } catch (error) {
        console.error("Error fetching national teams by championship:", error);
        res.status(500).json({ message: "An error occurred while fetching national teams." });
    }
};


// Create and Save a new Championship
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Championship
    const championship = {
        name: req.body.name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
    };

    // Save Championship in the database
    Championship.create(championship)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Championship."
            });
        });
};

// Retrieve all Championships from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;

    Championship.findAll({
            where: condition
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving championships."
            });
        });
};

// Find a single Championship with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Championship.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Championship with id=" + id
            });
        });
};

// Update a Championship by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Championship.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Championship was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Championship with id=${id}. Maybe Championship was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Championship with id=" + id
            });
        });
};

// Delete a Championship with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Championship.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Championship was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Championship with id=${id}. Maybe Championship was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Championship with id=" + id
            });
        });
};

// Delete all Championships from the database.
exports.deleteAll = (req, res) => {
    Championship.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Championships were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all championships."
            });
        });
};

