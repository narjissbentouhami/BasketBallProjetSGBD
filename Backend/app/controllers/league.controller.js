const db = require("../models");
const League = db.league;
const Op = db.Sequelize.Op;

// Create and Save a new League
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a League
    const league = {
        name: req.body.name,
        country: req.body.country,
    };

    // Save League in the database
    League.create(league)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the League."
            });
        });
};

// Retrieve all Leagues from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;

    League.findAll({
            where: condition
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving leagues."
            });
        });
};

// Find a single League with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    League.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving League with id=" + id
            });
        });
};

// Update a League by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    League.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "League was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update League with id=${id}. Maybe League was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating League with id=" + id
            });
        });
};

// Delete a League with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    League.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "League was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete League with id=${id}. Maybe League was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete League with id=" + id
            });
        });
};

// Delete all Leagues from the database.
exports.deleteAll = (req, res) => {
    League.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Leagues were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all leagues."
            });
        });
};

