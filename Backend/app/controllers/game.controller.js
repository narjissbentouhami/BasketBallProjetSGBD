const db = require("../models");
const Game = db.game;
const Club = db.club;
const NationalTeam = db.nationalTeam;
const PlayerStats = db.playerstats;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.date || !req.body.type) {
        res.status(400).send({
            message: "Date and type are required!"
        });
        return;
    }

    try {
        let gameData = {
            date: req.body.date,
            type: req.body.type,
            season: req.body.season,
            club_one_id: null,
            club_two_id: null,
            nationalTeam_one_id: null,
            nationalTeam_two_id: null,
            championship_id: req.body.championship_id,
            league_id: req.body.league_id,
            winner_id: req.body.winner_id,
        };

        if (req.body.type === "League") {
            // Validation spécifique pour League
            if (!req.body.club_one_id || !req.body.club_two_id) {
                res.status(400).send({
                    message: "For League type, club_one_id and club_two_id are required!"
                });
                return;
            }

            gameData.club_one_id = req.body.club_one_id;
            gameData.club_two_id = req.body.club_two_id;
        } else if (req.body.type === "Championship") {
            // Validation spécifique pour Championship
            if (!req.body.nationalTeam_one_id || !req.body.nationalTeam_two_id) {
                res.status(400).send({
                    message: "For Championship type, nationalTeam_one_id and nationalTeam_two_id are required!"
                });
                return;
            }

            gameData.nationalTeam_one_id = req.body.nationalTeam_one_id;
            gameData.nationalTeam_two_id = req.body.nationalTeam_two_id;
        } else {
            res.status(400).send({
                message: "Invalid game type! Must be either 'League' or 'Championship'."
            });
            return;
        }

        // Créer le jeu
        const game = await Game.create(gameData);

        // Inclure les détails pertinents dans la réponse
        const gameWithDetails = await Game.findOne({
            where: { id: game.id },
            include: [
                { model: Club, as: "clubOne" },
                { model: Club, as: "clubTwo" },
                { model: NationalTeam, as: "nationalTeamOne" },
                { model: NationalTeam, as: "nationalTeamTwo" },
            ],
        });

        res.status(201).send(gameWithDetails);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Game."
        });
    }
};



// Retrieve all Games from the database.
exports.findAll = (req, res) => {
    const date = req.query.date;
    var condition = date ? {
        date: {
            [Op.like]: `%${date}%`
        }
    } : null;

    Game.findAll({
            where: condition
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

// Find a single Game with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Game.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Game with id=" + id
            });
        });
};

// Update a Game by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Game.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Game was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Game with id=${id}. Maybe Game was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Game with id=" + id
            });
        });
};

// Delete a Game with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Game.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Game was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Game with id=${id}. Maybe Game was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Game with id=" + id
            });
        });
};

// Delete all Games from the database.
exports.deleteAll = (req, res) => {
    Game.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({
                message: `${nums} Games were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all games."
            });
        });
};




