export type UserEngineering = 'Sistemas' | 'Electronica' | 'Biomedica' | 'Industrial' | 'Ambiental';

export interface User {
  id: number;
  name: string;
  lastName: string;
  age: number;
  email: string;
  engineering: UserEngineering;
}

export type CreateUserInput = Omit<User, 'id'>;
