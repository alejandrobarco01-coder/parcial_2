const test = require('node:test');
const assert = require('node:assert/strict');
const { ListSalesUseCase } = require('../dist/application/use-cases/list-sales.use-case.js');
const { GetSaleByIdUseCase } = require('../dist/application/use-cases/get-sale-by-id.use-case.js');
const { CreateSaleUseCase } = require('../dist/application/use-cases/create-sale.use-case.js');
const { InMemorySalesRepository } = require('../dist/infrastructure/repositories/in-memory-sales.repository.js');
const { CustomError } = require('../dist/domain/erros/custom.error.js');

const sale = {
  id: 1,
  customer: 'Ana Gómez',
  item: 'Leche entera',
  quantity: 2,
  total: 9000,
  status: 'Pagada',
};

function repository(seed = [sale]) {
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

test('listar ventas valida el límite y delega en el repositorio', async () => {
  const repo = repository();
  assert.deepEqual(await new ListSalesUseCase(repo).execute(1), [sale]);
  await assert.rejects(() => new ListSalesUseCase(repo).execute(0), RangeError);
  await assert.rejects(() => new ListSalesUseCase(repo).execute(101), RangeError);
  await assert.rejects(() => new ListSalesUseCase(repo).execute(1.5), RangeError);
});

test('consultar por id valida, encuentra y reporta ausencia', async () => {
  const useCase = new GetSaleByIdUseCase(repository());
  assert.deepEqual(await useCase.execute(1), sale);
  await assert.rejects(() => useCase.execute(0), (error) => error instanceof CustomError && error.statusCode === 400);
  await assert.rejects(() => useCase.execute(2), (error) => error instanceof CustomError && error.statusCode === 404);
});

test('crear venta normaliza campos y rechaza datos inválidos', async () => {
  const repo = repository();
  const useCase = new CreateSaleUseCase(repo);
  const created = await useCase.execute({
    customer: '  Carlos Rojas ',
    item: '  Manzana roja ',
    quantity: 3,
    total: 9600,
    status: 'Pendiente',
  });
  assert.equal(created.customer, 'Carlos Rojas');
  assert.equal(created.item, 'Manzana roja');
  assert.equal(created.quantity, 3);
  assert.equal(created.total, 9600);
  assert.equal(created.status, 'Pendiente');
  assert.equal(created.id, 2);

  await assert.rejects(() => useCase.execute({ customer: '', item: 'X', quantity: 1, total: 10, status: 'Pagada' }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ customer: 'A', item: '', quantity: 1, total: 10, status: 'Pagada' }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ customer: 'A', item: 'X', quantity: 0, total: 10, status: 'Pagada' }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ customer: 'A', item: 'X', quantity: 1, total: 0, status: 'Pagada' }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ customer: 'A', item: 'X', quantity: 1, total: 10, status: 'Cancelada' }), (error) => error.statusCode === 400);
});

test('adaptador en memoria lista, busca y crea ventas', async () => {
  const repo = new InMemorySalesRepository();
  const first = (await repo.findAll(1))[0];
  assert.ok(first);
  assert.equal((await repo.findAll(2)).length, 2);
  assert.deepEqual(await repo.findById(first.id), first);
  assert.equal(await repo.findById(999), null);
  const created = await repo.create({ customer: 'Laura', item: 'Pan', quantity: 1, total: 2000, status: 'Entregada' });
  assert.equal(created.id, 3);
  assert.deepEqual(await repo.findById(created.id), created);
});

