import { createClient, print } from 'redis';
import { promisify } from "util";

const client = createClient();
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});
client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
})

const updateHash = (hashName, fieldName, fieldValue) => {
  client.HSET(hashName, fieldName, fieldValue, print);
}

const printHash = async (hashName) => {
  console.log( await promisify(client.HGETALL).bind(client)(hashName));
};

const main = () => {
  const hashObj = {
    Portland: 50,
    seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };
  for (const [field, value] of Object.entries(hashObj)) {
    updateHash('HolbertonSchools', field, value);
  }
  printHash('HolbertonSchools');
};
