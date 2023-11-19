import mysql from 'mysql2/promise';

const _config = {
  host: process.env.DB_HOST,
  port: 3306,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const get = async <T>(query: string, params: string | number[]): Promise<T> => {
  const connection = await mysql.createConnection(_config);

  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await connection.execute(query, params);
      resolve(rows as T);
    } catch (error) {
      reject();
    } finally {
      await connection.end();
    }
  });
};

const crud = async <T>(query: string, params: (string | number)[]): Promise<void> => {
  const connection = await mysql.createConnection(_config);

  return new Promise(async (resolve, reject) => {
    try {
      const [result] = await connection.query(query, params);
      const { affectedRows } = result as CrudResponse;
      affectedRows ? resolve() : reject();
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

interface CrudResponse {
  affectedRows: number;
}

export default { get, crud };
