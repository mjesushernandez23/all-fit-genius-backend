interface SharedProps {
  created: string;
  last_login?: string;
  enabled: boolean;
}

export interface DBTrainer extends SharedProps {
  trainer_id: number;
  name: string;
  email: string;
  password: string;
}

export interface DBUserProps extends SharedProps {
  user_id: number;
  name: string;
  email: string;
  password: string;
  trainer_id: number;
}
