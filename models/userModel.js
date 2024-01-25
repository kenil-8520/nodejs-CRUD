module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
    },)
    return User
}
