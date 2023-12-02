const express = require('express');
const redis = require('redis');
const util = require('util');

const app = express();
const PORT = 1245;
const redisClient = redis.createClient();
const promisify = util.promisify

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, stock: 4, initialAvaliableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, stock: 10, initialAvaliableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, stock: 2, initialAvaliableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, stock: 5, initialAvaliableQuantity: 5 },
]

const getItemById = (id) => {
  return listProducts.filter((item) => item.itemId === id)[0]
}

const reserveStockById = (itemId, stock) => {
  return promisify(redisClient.SET).bind(redisClient)(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  return await promisify(redisClient.GET).bind(redisClient)(`item.${itemId}`);
};

app.get('/list_products', (_, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (item) {
    const stock = await getCurrentReservedStockById(itemId);
    console.log('der', stock)
    const resItem = {
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      initialAvaliableQuantity: item.initialAvaliableQuantity,
      currentQuantity: stock !== null? parseInt(stock) : item.initialAvaliableQuantity,
    };
    res.json(resItem);
  } else {
    res.json({
      'status': 'Product not found',
    });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (!item) {
    res.json({
      'status': 'Product not found',
    });
  }

  let currentStock = await getCurrentReservedStockById(itemId);
  if (currentStock !== null) {
    currentStock = parseInt(currentStock);
    if (currentStock > 0) {
      reserveStockById(itemId, currentStock -1);
      res.json({
        'status': 'Reservation confirm', 'itemId': itemId,
      });
    } else {
      res.json({
        'status': 'Not enough stock available', 'itemId': itemId,
      });
    }
  } else {
    reserveStockById(itemId, item.initialAvaliableQuantity - 1);
    res.json({
      'status': 'Reservation confirmation', 'itemId': itemId,
    });
  };
})

const resetProductStock = () => {
  return Promise.all(
    listProducts.map(item => promisify(redisClient.SET).bind(redisClient)(`item.${item.itemId}`, 0))
  )
}

app.listen(PORT, () => {
  resetProductStock();
  console.log(`app listening at http://localhost:${PORT}`);
});