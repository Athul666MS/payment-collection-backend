import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Payment extends Model {
  declare id: number;
  declare customer_id: number;
  declare transaction_id: string;
  declare payment_date: Date;
  declare payment_amount: number;
  declare status: 'SUCCESS' | 'FAILED' | 'PENDING';
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    payment_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING'),
      allowNull: false,
      defaultValue: 'SUCCESS',
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Payment;
