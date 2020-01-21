module.exports = function (sequelize, DataTypes) {
  var Event = sequelize.define("Event", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Event.associate = models => {
    models.Event.belongsTo(models.User, { as: "host" })
    models.Event.hasMany(models.UserEvent, { onDelete: "cascade" })
  }
  return Event;
}