import { Request, Response } from 'express';
import bs from 'bcryptjs';
import { singToken } from '../../utils/jwt';
import query from '../../config/database';
import { dateCurrent } from '../../utils/date';
import type { DBTrainer } from '../../models';

export const loginTrainer = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await query
    .get<DBTrainer[]>('select * from Trainer where email = ?', [email])
    .then(data => (bs.compareSync(password, data[0].password) ? data[0] : null))
    .catch(() => null);

  if (!result) return res.status(400).json('Error email o contraseña');
  if (!result.enabled)
    return res.status(403).json({ message: 'Inactive user. Please contact support to reactivate your account.' });
  const { trainer_id, password: p, ...rest } = result;

  const updateQuery = `update Trainer set last_login = ? where trainer_id = ?;`;

  await query
    .crud(updateQuery, [dateCurrent(), trainer_id])
    .then(() => {})
    .catch(() => {});

  const token = singToken({ trainer_id, ...rest });
  res.cookie('token', token, { httpOnly: true, secure: true });

  return res.status(200).json({});
};

export const createTrainer = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const insert = `insert into Trainer (email, name, password, created) values (?,?,?,?)`;
  const params = [email, name, bs.hashSync(password), dateCurrent()];
  return await query
    .crud(insert, params)
    .then(() => res.status(200).json({}))
    .catch(e => res.status(500).json({ message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' }));
};
