import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Customer extends Model {
  declare id: number;
  declare account_number: string;
  declare customer_name: string;
  declare issue_date: Date;
  declare interest_rate: number;
  declare tenure: number;
  declare emi_due: number;
  declare remaining_balance: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    tenure: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emi_due: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remaining_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Customer;
