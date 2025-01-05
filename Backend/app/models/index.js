const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.player = require("../models/player.model.js")(sequelize, Sequelize);
db.club = require("../models/club.model.js")(sequelize, Sequelize);
db.league = require("../models/league.model.js")(sequelize, Sequelize);
db.nationalTeam = require("../models/nationalTeam.model.js")(sequelize, Sequelize);
db.game = require("../models/game.model.js")(sequelize, Sequelize);
db.playerStats = require("../models/playerStats.model.js")(sequelize, Sequelize);
db.championship = require("../models/championship.model.js")(sequelize, Sequelize);
db.sponsor = require("../models/sponsor.model.js")(sequelize, Sequelize);

db.player.belongsTo(db.nationalTeam, { foreignKey: 'nationalTeam_id' });
db.nationalTeam.hasMany(db.player, { foreignKey: 'nationalTeam_id' });

db.nationalTeam.belongsTo(db.championship,{ through: 'championship_id' });
db.championship.hasMany(db.nationalTeam, { foreignKey: 'championship_id' });

db.player.belongsTo(db.club, { foreignKey: 'club_id' });
db.club.hasMany(db.player, { foreignKey: 'club_id' });

db.club.hasMany(db.game, { foreignKey: "club_one_id", as: "clubOneGames" });
db.club.hasMany(db.game, { foreignKey: "club_two_id", as: "clubTwoGames" });
db.game.belongsTo(db.club, { foreignKey: "club_one_id", as: "clubOne" });
db.game.belongsTo(db.club, { foreignKey: "club_two_id", as: "clubTwo" });

db.nationalTeam.hasMany(db.game, { foreignKey: "nationalTeam_one_id", as: "nationalTeamOneGames" });
db.nationalTeam.hasMany(db.game, { foreignKey: "nationalTeam_two_id", as: "nationalTeamTwoGames" });
db.game.belongsTo(db.nationalTeam, { foreignKey: "nationalTeam_one_id", as: "nationalTeamOne" });
db.game.belongsTo(db.nationalTeam, { foreignKey: "nationalTeam_two_id", as: "nationalTeamTwo" });

db.championship.hasMany(db.game, { foreignKey: "championship_id", as: "games" });
db.game.belongsTo(db.championship, { foreignKey: "championship_id", as: "championship" });
db.league.hasMany(db.game, { foreignKey: "league_id", as: "games" });
db.game.belongsTo(db.league, { foreignKey: "league_id", as: "league" });



db.sponsor.hasMany(db.club, { foreignKey: 'sponsor_id' });
db.club.belongsTo(db.sponsor, { foreignKey: 'sponsor_id' });

db.sponsor.hasMany(db.nationalTeam, { foreignKey: 'sponsor_id' });
db.nationalTeam.belongsTo(db.sponsor, { foreignKey: 'sponsor_id' });

db.game.hasMany(db.playerStats, { foreignKey: 'game_id' });
db.playerStats.belongsTo(db.game, { foreignKey: 'game_id' });
db.player.hasMany(db.playerStats, { foreignKey: 'player_id' });
db.playerStats.belongsTo(db.player, { foreignKey: 'player_id' });



db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully.");
}).catch((err) => {
  console.error("Error syncing database:", err);
});

module.exports = db;
