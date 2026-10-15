const test = require('node:test');
const assert = require('node:assert/strict');
const { ListProductsUseCase } = require('../dist/application/use-cases/list-products.use-case.js');
const { GetProductByIdUseCase } = require('../dist/application/use-cases/get-product-by-id.use-case.js');
const { CreateProductUseCase } = require('../dist/application/use-cases/create-product.use-case.js');
const { InMemoryProductsRepository } = require('../dist/infrastructure/repositories/in-memory-products.repository.js');
const { CustomError } = require('../dist/domain/erros/custom.error.js');

const product = {
  id: 1,
  name: 'Leche entera',
  category: 'Lacteos',
  price: 4500,
};

function repository(seed = [product]) {
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

test('listar productos valida el límite y delega en el repositorio', async () => {
  const repo = repository();
  assert.deepEqual(await new ListProductsUseCase(repo).execute(1), [product]);
  await assert.rejects(() => new ListProductsUseCase(repo).execute(0), RangeError);
  await assert.rejects(() => new ListProductsUseCase(repo).execute(101), RangeError);
  await assert.rejects(() => new ListProductsUseCase(repo).execute(1.5), RangeError);
});

test('consultar por id valida, encuentra y reporta ausencia', async () => {
  const useCase = new GetProductByIdUseCase(repository());
  assert.deepEqual(await useCase.execute(1), product);
  await assert.rejects(() => useCase.execute(0), (error) => error instanceof CustomError && error.statusCode === 400);
  await assert.rejects(() => useCase.execute(2), (error) => error instanceof CustomError && error.statusCode === 404);
});

test('crear producto normaliza campos y rechaza datos inválidos', async () => {
  const repo = repository();
  const useCase = new CreateProductUseCase(repo);
  const created = await useCase.execute({ name: '  Arroz ', category: 'Verduras', price: 7000 });
  assert.equal(created.name, 'Arroz');
  assert.equal(created.category, 'Verduras');
  assert.equal(created.price, 7000);
  assert.equal(created.id, 2);
  await assert.rejects(() => useCase.execute({ name: ' ', category: 'Frutas', price: 100 }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ name: 'Arroz', category: 'Invalida', price: 100 }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ name: 'Arroz', category: 'Frutas', price: 0 }), (error) => error.statusCode === 400);
  await assert.rejects(() => useCase.execute({ name: 'Arroz', category: 'Frutas', price: -10 }), (error) => error.statusCode === 400);
});

test('adaptador en memoria lista, busca y crea productos', async () => {
  const repo = new InMemoryProductsRepository();
  const first = (await repo.findAll(1))[0];
  assert.ok(first);
  assert.equal((await repo.findAll(2)).length, 2);
  assert.deepEqual(await repo.findById(first.id), first);
  assert.equal(await repo.findById(999), null);
  const created = await repo.create({ name: 'Pera', category: 'Frutas', price: 3000 });
  assert.equal(created.id, 3);
  assert.deepEqual(await repo.findById(created.id), created);
});

