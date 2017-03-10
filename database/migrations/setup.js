
module.exports = {
  up: function (queryInterface, Sequelize) {
    var bcrypt = require('bcrypt')
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync('123456', salt)
    
    return [
      // users model
      queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        salt: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING(11),
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      }),
      queryInterface.addIndex('Users', ['phone_number']),
      queryInterface.bulkInsert('Users',[
        {
          id: 1,
          name: 'demo',
          password: hash,
          salt: salt,
          email: 'demo@who.com',
          phoneNumber: '13200000000',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ])
    ]
  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.dropAllTables()
  }
} 