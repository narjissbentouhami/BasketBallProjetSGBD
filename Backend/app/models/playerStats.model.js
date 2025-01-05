module.exports = (sequelize, Sequelize) => {
    const  PlayerStats = sequelize.define("playerstats", {
        points_3: Sequelize.INTEGER,
        points_2: Sequelize.INTEGER,
        free_throws: Sequelize.INTEGER,
        success_percentage: Sequelize.FLOAT,
        assists: Sequelize.INTEGER,
        rebounds: Sequelize.INTEGER,
        blocks: Sequelize.INTEGER,
        fouls: Sequelize.INTEGER,
    });
  
    return PlayerStats;
  };