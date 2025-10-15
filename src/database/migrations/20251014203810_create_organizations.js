export const up = async (sequelize, DataType) => {
	await sequelize.createTable('organizations', {
		id: {
			type: DataType.STRING(26),
			primaryKey: true,
		},
		name: {
			type: DataType.STRING(255),
			allowNull: false,
		},
		createdAt: {
			type: DataType.DATE(),
			allowNull: false,
		},
		updatedAt: {
			type: DataType.DATE(),
			allowNull: false,
		},
	});
};

export const down = async (sequelize) => {
	await sequelize.dropTable('organizations');
};
