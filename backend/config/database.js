import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Railway pe PostgreSQL use hoga
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local pe SQLite (koi installation nahi, bas ek file)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',  // yahi database file banegi
    logging: false
  });
}

export default sequelize;