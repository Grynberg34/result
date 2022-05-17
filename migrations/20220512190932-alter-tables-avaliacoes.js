'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('avaliações', 'numero_perguntas');
    await queryInterface.removeColumn('avaliações', 'texto');
    await queryInterface.removeColumn('avaliações_semestre', 'pontos_pergunta');
    await queryInterface.removeColumn('avaliações_semestre', 'pontos_total');
    await queryInterface.dropTable('gabaritos');
    await queryInterface.dropTable('avaliações_respostas');
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }

};
