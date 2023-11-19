import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const _seed = process.env.JWT_SEED;

interface UserCookieReq {
  user_id?: number;
  trainer_id: number;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserCookieReq;
    }
  }
}

const _verifySing = (token: string, isTrainer?: boolean): Promise<UserCookieReq> => {
  if (!_seed || !token) throw new Error('Undefined');

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, _seed, (err, payload) => {
        if (err) return reject(err);
        const user = payload as UserCookieReq;
        if (isTrainer && user?.user_id) throw new Error('Forbidden: Insufficient permissions');
        resolve(user);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const _middlewareTrainer = () => async (req: Request, res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies.token;

  if (!tokenFromCookie) return res.status(401).json({ message: 'Unauthorized: Token not provided' });

  await _verifySing(tokenFromCookie, true)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(e => {
      res.clearCookie('token');
      req.user = undefined;
      res.status(403).json(e.message || 'Forbidden: Insufficient permissions');
    });
};

const _middlewareUser = () => async (req: Request, res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies.token;

  if (!tokenFromCookie) return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  await _verifySing(tokenFromCookie)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(e => {
      res.clearCookie('token');
      req.user = undefined;
      res.status(403).json(e.message || 'Forbidden: Insufficient permissions');
    });
};

export default {
  trainer: _middlewareTrainer(),
  user: _middlewareUser(),
};
