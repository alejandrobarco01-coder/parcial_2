const test = require('node:test');
const assert = require('node:assert/strict');
const { ListUsersUseCase } = require('../dist/application/use-cases/list-users.use-case.js');
const { GetUserByIdUseCase } = require('../dist/application/use-cases/get-user-by-id.use-case.js');
const { CreateUserUseCase } = require('../dist/application/use-cases/create-user.use-case.js');
const { InMemoryUsersRepository } = require('../dist/infrastructure/repositories/in-memory-users.repository.js');
const { CustomError } = require('../dist/domain/erros/custom.error.js');

const user = {
  id: 1,
  name: 'Ana',
  lastName: 'Gómez',
  age: 22,
  email: 'ana@example.com',
  engineering: 'Sistemas',
};

function repository(seed = [user]) {
  return {
    items: [...seed],
    async findAll(limit) { return this.items.slice(0, limit); },
    async findById(id) { return this.items.find((item) => item.id === id) ?? null; },
    async create(input) {
      const created = { id: this.items.length + 1, ...input };
      this.items.push(created);
      return created;
    },
  };
}

test('listar usuarios valida el límite y delega en el repositorio', async () => {
  const repo = repository();
  assert.deepEqual(await new ListUsersUseCase(repo).execute(1), [user]);
  await assert.rejects(() => new ListUsersUseCase(repo).execute(0), RangeError);
  await assert.rejects(() => new ListUsersUseCase(repo).execute(101), RangeError);
  await assert.rejects(() => new ListUsersUseCase(repo).execute(1.5), RangeError);
});

test('consultar por id valida, encuentra y reporta ausencia', async () => {
  const useCase = new GetUserByIdUseCase(repository());
  assert.deepEqual(await useCase.execute(1), user);
  await assert.rejects(() => useCase.execute(0), (error) => error instanceof CustomError && error.statusCode === 400);
  await assert.rejects(() => useCase.execute(2), (error) => error instanceof CustomError && error.statusCode === 404);
});

test('crear usuario normaliza campos y rechaza datos inválidos', async () => {
  const repo = repository();
  const useCase = new CreateUserUseCase(repo);
  const created = await useCase.execute({ ...user, id: undefined, name: '  Luis ', lastName: ' Pérez ', email: ' LUIS@EXAMPLE.COM ' });
  assert.equal(created.name, 'Luis');
  assert.equal(created.lastName, 'Pérez');
  assert.equal(created.email, 'luis@example.com');
  assert.equal(created.id, 2);
  await assert.rejects(() => useCase.execute({ ...user, name: ' ' }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ ...user, age: 17 }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ ...user, age: 22.5 }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ ...user, email: 'invalid' }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ ...user, engineering: 'Derecho' }), (error) => error.statusCode === 400);
});

test('adaptador en memoria lista, busca y crea usuarios', async () => {
  const repo = new InMemoryUsersRepository();
  const first = (await repo.findAll(2))[0];
  assert.ok(first);
  assert.equal((await repo.findAll(3)).length, 3);
  assert.deepEqual(await repo.findById(first.id), first);
  assert.equal(await repo.findById(999), null);
  const created = await repo.create({ name: 'Eva', lastName: 'Ruiz', age: 25, email: 'eva@example.com', engineering: 'Industrial' });
  assert.equal(created.id, 4);
  assert.deepEqual(await repo.findById(created.id), created);
});
