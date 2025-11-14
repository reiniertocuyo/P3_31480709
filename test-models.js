const { sequelize, Category, Tag, Product } = require('./models');

async function testModels() {
  try {
    await sequelize.sync({ force: true }); //Esto borra y recrea todas las tablas

    // Crear categorías
    const category = await Category.create({
      name: 'Series Clásicas',
      description: 'Compilaciones de series animadas clásicas de Cartoon Network'
    });

    // Crear tags
    const tag1 = await Tag.create({ name: 'Cartoon Network' });
    const tag2 = await Tag.create({ name: 'Edición Limitada' });

    // Crear producto
    const product = await Product.create({
      name: 'Edición Coleccionista de Coraje el Perro Cobarde',
      description: 'Incluye todas las temporadas remasterizadas en DVD',
      price: 29.99,
      stock: 50,
      format: 'DVD',
      series: 'Coraje el Perro Cobarde',
      season: 1,
      language: 'Español Latino',
      release_year: 2002,
      publisher: 'Warner Bros',
      categoryId: category.id
    });

    // Asociar tags al producto
    await product.setTags([tag1, tag2]);

    // Consultar y mostrar
    const result = await Product.findOne({
      where: { id: product.id },
      include: [Category, Tag]
    });

    console.log('Producto creado con relaciones:');
    console.dir(result.toJSON(), { depth: null });

  } catch (error) {
    console.error('Error durante la prueba de modelos:', error);
  } finally {
    await sequelize.close();
  }
}

testModels();
