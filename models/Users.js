module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        contracted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        infected: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    });
};