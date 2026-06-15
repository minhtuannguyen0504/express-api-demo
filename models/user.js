const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {
    //   User.hasOne(models.Profile, { foreignKey: "userId", as: "profile" });
    // }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Sequelize validation
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(0, 1), // 0 = user && 1 == admin
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      // Ấn password khỏi các kết quả trả về mặc định
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        // Scope để lấy user kèm password khi cần
        withPassword: {
          attributes: {},
        },
      },
    },
  );
  return User;
};
