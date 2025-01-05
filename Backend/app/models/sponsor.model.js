module.exports = (sequelize, Sequelize) => {
    const Sponsor = sequelize.define("sponsor", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING,
    });
  
    return Sponsor;
  };