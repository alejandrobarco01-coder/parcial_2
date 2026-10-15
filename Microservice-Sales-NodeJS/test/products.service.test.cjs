const test = require('node:test');
const assert = require('node:assert/strict');
const { ProductsService } = require('../dist/presentation/modules/products/products.service.js');

test('lista productos con límite válido', async () => {
  const service = new ProductsService();
  assert.equal((await service.getAllProducts(1)).length, 1);
});

test('rechaza límites inválidos', async () => {
  const service = new ProductsService();
  await assert.rejects(service.getAllProducts(0), /limit/);
});

test('consulta producto por id y crea un producto válido', async () => {
  const service = new ProductsService();
  assert.equal((await service.getProductById(1)).name, 'Leche entera');
  assert.equal(await service.getProductById(999), undefined);
  const created = await service.createProduct({ name: 'Arroz', category: 'Verduras', price: 7000 });
  assert.deepEqual(created, { id: 3, name: 'Arroz', category: 'Verduras', price: 7000 });
});

test('rechaza productos inválidos', async () => {
  const service = new ProductsService();
  await assert.rejects(service.createProduct({ name: '', category: 'Frutas', price: 20 }), /inválido/);
  await assert.rejects(service.createProduct({ name: 'A', category: 'Frutas', price: 0 }), /inválido/);
});
