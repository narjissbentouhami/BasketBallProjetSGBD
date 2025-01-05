module.exports = (sequelize, Sequelize) => {
    const Nationalteam = sequelize.define("Nationalteam", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING,
        country: Sequelize.STRING,
    });
  
    return Nationalteam;
  };