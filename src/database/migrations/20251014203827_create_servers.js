export const up = async (sequelize, DataType) => {
	await sequelize.createTable('servers', {
		id: {
			type: DataType.STRING(26),
			primaryKey: true,
		},
		org_id: {
			type: DataType.STRING(26),
			allowNull: false,
			references: {
				model: 'organizations',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
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
	await sequelize.dropTable('servers');
};
