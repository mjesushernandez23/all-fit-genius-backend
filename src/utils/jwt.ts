import jwt from 'jsonwebtoken';
const seed = process.env.JWT_SEED;

interface SingToken {
  trainer_id: number;
  user_id?: number;
  email: string;
  name: string;
}

export const singToken = (values: SingToken) => {
  if (!seed) throw new Error('sin palabra semilla');

  return jwt.sign(values, seed, { expiresIn: '1d' });
};

export const hasPermissions = (roles: number[], token: string): Promise<boolean> => {
  if (!seed || !token) throw new Error('sin palabra semilla');
  return new Promise((resolve, reject) => {
    if (!token) return reject(false);

    try {
      jwt.verify(token, seed, (err, payload) => {
        console.log('err', err, payload);
        if (err) return reject(false);
        const { rol } = payload as { rol: number };
        resolve(roles.includes(rol));
      });
    } catch (error) {
      console.log('catch error ');
      reject(false);
    }
  });
};

export const isValidToken = (token: string): Promise<number> => {
  if (!seed) throw new Error('sin palabra semilla');
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, seed, (err, payload) => {
        console.log('err', err, payload);
        if (err) return reject('JWT no es valido');
        const { _id } = payload as { _id: number };
        resolve(_id);
      });
    } catch (error) {
      console.log('catch error ');
      reject('JWT no es valido');
    }
  });
};
