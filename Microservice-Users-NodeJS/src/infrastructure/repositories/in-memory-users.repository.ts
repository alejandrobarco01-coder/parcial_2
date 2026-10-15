import { CreateUserInput, User } from '../../domain/interfaces/user.interface';
import { UsersRepository } from '../../application/ports/users.repository';

/** Adaptador temporal en memoria para ejecutar el servicio sin una base de datos. */
export class InMemoryUsersRepository implements UsersRepository {
  private readonly users: User[] = [
    { id: 1, name: 'Ana', lastName: 'Gómez', age: 24, email: 'ana.gomez@example.com', engineering: 'Industrial' },
    { id: 2, name: 'Carlos', lastName: 'Ramírez', age: 22, email: 'carlos.ramirez@example.com', engineering: 'Sistemas' },
    { id: 3, name: 'María', lastName: 'López', age: 25, email: 'maria.lopez@example.com', engineering: 'Biomedica' },
  ];

  async findAll(limit: number): Promise<User[]> {
    return this.users.slice(0, limit).map((user) => ({ ...user }));
  }

  async findById(id: number): Promise<User | null> {
    const user = this.users.find((candidate) => candidate.id === id);
    return user ? { ...user } : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user: User = { id: this.nextId(), ...input };
    this.users.push(user);
    return { ...user };
  }

  private nextId(): number {
    return this.users.reduce((highest, user) => Math.max(highest, user.id), 0) + 1;
  }
}
