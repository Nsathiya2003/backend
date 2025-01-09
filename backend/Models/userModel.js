import { DataTypes } from 'sequelize';
import ConnectDB from '../dbConfig/db.js';

const User = ConnectDB.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token:{
    type:DataTypes.STRING,
    allowNull:true
  },
  resetOTP :{
    type :DataTypes.STRING,
    allowNull:true
  }
}, {
  timestamps: true, 
});

ConnectDB.sync({ alter: true }) 
  .then(() => console.log('Tables synced successfully'))
  .catch((err) => console.error('Error syncing tables:', err));

export default User;
 