module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define("Player", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        height: Sequelize.FLOAT,
        citizenship: Sequelize.STRING,
    });
  
    return Player;
  };