
module.exports = (sequelize, DataTypes) => {
    const employee = sequelize.define("employee", {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false
        },
        mobile: {
            type: DataTypes.STRING(15),
            unique: true,
            allowNull: false
        },
    },)
    return employee
}
