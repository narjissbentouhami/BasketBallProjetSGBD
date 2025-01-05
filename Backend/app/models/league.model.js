module.exports = (sequelize, Sequelize) => {
    const League = sequelize.define("League", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING,
        country: Sequelize.STRING,
    });
  
    return League;
  };