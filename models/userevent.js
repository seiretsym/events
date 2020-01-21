
module.exports = function (sequelize, DataTypes) {
  var UserEvent = sequelize.define("UserEvent", {
  });

  UserEvent.associate = models => {
    models.UserEvent.belongsTo(models.User, { onDelete: "cascade" });
    models.UserEvent.belongsTo(models.Event, { onDelete: "cascade" });
  }

  return UserEvent;
}