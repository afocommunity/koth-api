// @ts-check
/**
 *
 * @param {import('sequelize').QueryInterface} sequelize
 */
export const up = async (sequelize) => {
  await sequelize.addConstraint('api_tokens', {
    fields: ['org_id'],
    type: 'foreign key',
    name: 'api_tokens_org_id_fkey',
    references: {
      table: 'organizations',
      field: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });


  await sequelize.addConstraint('api_tokens', {
    fields: ['server_id'],
    type: 'foreign key',
    name: 'api_tokens_server_id_fkey',
    references: {
      table: 'servers',
      field: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
};

/**
 *
 * @param {import('sequelize').QueryInterface} sequelize
 */
export const down = async (sequelize) => {
  await sequelize.removeConstraint('api_tokens', 'api_tokens_server_id_fkey');
  await sequelize.removeConstraint('api_tokens', 'api_tokens_org_id_fkey');
};
