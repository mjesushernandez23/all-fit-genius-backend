import { Request, Response } from 'express';
import query from '../../config/database';
import { DBMachine } from '../../models/machines.model';
import { isValidString, isValidNumber } from '../../utils/validators';

export const getMachine = async (req: Request, res: Response) => {
  const {} = req.query;
};

type PostMachineBody = Omit<DBMachine, 'trainer_id' | 'machine_id'>;

export const postMachine = async (req: Request, res: Response) => {
  const { name } = req.body as PostMachineBody;
  const user = req.user;
  if (!user) return res.status(403).json({ message: 'Forbidden: Invalid token' });

  if (!isValidString(name)) return res.status(400).json({ message: 'Invalid params' });

  const insertQuery = `insert into Machine (trainer_id, name) values (?,?);`;
  const params = [user.trainer_id, name];

  return await query
    .crud(insertQuery, params)
    .then(data => {
      console.log('data', data);
      res.status(200).json({ message: 'paso' });
    })
    .catch(e => {
      res.status(500).json({ message: 'Internal Server Error' });
    });
};
