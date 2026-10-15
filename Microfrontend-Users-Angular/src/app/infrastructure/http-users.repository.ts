import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UsersRepository } from '../application/ports/users.repository';
import { CreateUserInput, User } from '../domain/user.model';

/** Adaptador HTTP que comunica los casos de uso con el microservicio de Usuarios. */
@Injectable({ providedIn: 'root' })
export class HttpUsersRepository implements UsersRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001/api/users';

  findAll(limit: number): Promise<User[]> {
    const params = new HttpParams().set('limit', limit);
    return firstValueFrom(this.http.get<User[]>(this.baseUrl, { params }));
  }

  findById(id: number): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.baseUrl}/${id}`));
  }

  create(input: CreateUserInput): Promise<User> {
    return firstValueFrom(this.http.post<User>(this.baseUrl, input));
  }
}
