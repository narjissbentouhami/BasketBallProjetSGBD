module.exports = (sequelize, Sequelize) => {
    const Championship = sequelize.define("Championship", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
    });
  
    return Championship;
  };