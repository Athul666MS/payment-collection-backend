import sequelize from '../config/database';
import Customer from './Customer';
import Payment from './Payment';

// Define Associations
Customer.hasMany(Payment, {
  foreignKey: 'customer_id',
  as: 'payments',
});

Payment.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer',
});

export { sequelize, Customer, Payment };
