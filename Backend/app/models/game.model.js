module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("game", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: Sequelize.DATE,
        type: {
            type: Sequelize.ENUM("League", "Championship"), // Restrict to valid types
            allowNull: false,
          },
        season: Sequelize.STRING,
        winner_id: {
          type: Sequelize.INTEGER,
          allowNull: true, // Null initially until the game is completed
        },
    });
  
    return Game;
  };
  