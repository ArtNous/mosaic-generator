'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mosaic extends Model {
    static associate(models) {
      // define association here
    }
  };

  Mosaic.init({
    path: DataTypes.STRING,
    matrix: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mosaic',
  });
  
  return Mosaic;
};