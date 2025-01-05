const db = require("../models");
const NationalTeam = db.nationalTeam;
const Op = db.Sequelize.Op;

// Create and Save a new NationalTeam
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a NationalTeam
    const nationalTeam = {
        name: req.body.name,
        country: req.body.country,
        championship_id: req.body.championship_id,
        sponsor_id: req.body.sponsor_id,
    };

    // Save NationalTeam in the database
    NationalTeam.create(nationalTeam)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the NationalTeam."
            });
        });
};

// Retrieve all NationalTeams from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;

    NationalTeam.findAll({
            where: condition
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving nationalteams."
            });
        });
};

// Find a single NationalTeam with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    NationalTeam.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving NationalTeam with id=" + id
            });
        });
};

// Update a NationalTeam by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    NationalTeam.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "NationalTeam was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update NationalTeam with id=${id}. Maybe NationalTeam was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating NationalTeam with id=" + id
            });
        });
};

// Delete a NationalTeam with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    NationalTeam.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "NationalTeam was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete NationalTeam with id=${id}. Maybe NationalTeam was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete NationalTeam with id=" + id
            });
        });
};

// Delete all NationalTeams from the database.
exports.deleteAll = (req, res) => {
    NationalTeam.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} NationalTeams were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all nationalteams."
            });
        });
};

