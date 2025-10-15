export const up = async (sequelize, DataType) => {
  await sequelize.createTable('form_state', {
    id: {
      type: DataType.STRING(26),
      primaryKey: true,
    },
    message_id: {
      type: DataType.STRING(20),
    },
    user_id: {
      type: DataType.STRING(20),
    },
    type: {
      type: DataType.STRING(20),
    },
    data: DataType.TEXT(),
    createdAt: {
      type: DataType.DATE(),
    },
    updatedAt: {
      type: DataType.DATE(),
    },
  });
};
export const down = async (sequelize) => {
  await sequelize.dropTable('form_state');
}
