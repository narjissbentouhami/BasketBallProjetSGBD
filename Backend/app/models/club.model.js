module.exports = (sequelize, Sequelize) => {
    const Club = sequelize.define("Club", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING,
        city: Sequelize.STRING,
    });
  
    return Club;
  };