import { Request, Response } from 'express';
import bs from 'bcryptjs';
import query from '../../config/database';
import { singToken } from '../../utils/jwt';
import type { DBUserProps } from '../../models';
import { dateCurrent } from '../../utils/date';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await query
    .get<DBUserProps[]>('select * from User where email = ?', [email])
    .then(data => (bs.compareSync(password, data[0].password) ? data[0] : null))
    .catch(() => null);

  if (!result) return res.status(400).json('Error email o contraseña');
  const { trainer_id, user_id, name } = result;
  if (!result.enabled)
    return res.status(403).json({ message: 'Inactive user. Please contact support to reactivate your account.' });

  const updateQuery = `update User set last_login = ? where user_id = ? ;`;
  await query
    .crud(updateQuery, [dateCurrent(), user_id])
    .then(() => {})
    .catch(() => {});
  const token = singToken({ user_id, trainer_id, name, email });
  res.cookie('token', token, { httpOnly: true, secure: true });

  return res.status(200).json({});
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as Omit<DBUserProps, 'user_id' | 'trainer_id'>;

  const user = req.user;
  if (!user) return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });

  const insert = `insert into User (trainer_id, email, name, password, created) values (?,?,?,?,?)`;
  const params = [user.trainer_id, email, name, bs.hashSync(password), dateCurrent()];
  return await query
    .crud(insert, params)
    .then(() => res.status(200).send('paso'))
    .catch(e => res.status(500).json({ message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' }));
};
