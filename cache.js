const _cache = {};

function registerCache(key, fn) {
  if (_cache[key]) {
    console.warn(`Cache for ${key} already exists. Overwriting...`);
  }

  _cache[key] = {
    loader: fn,
    data: null,
  };
}

async function initCache() {
  const entries = Object.entries(_cache);
  await Promise.all(
    entries.map(async ([key, cache]) => {
      cache.data = await cache.loader();
      console.log(`Cache for ${key} initialized.`);
    })
  );
}

function getCache(key) {
  const cache = _cache[key];
  if (!cache) {
    throw new Error(`Cache for ${key} not found.`);
  }

  if (!cache.data) {
    throw new Error(`Cache for ${key} not initialized.`);
  }

  return cache.data;
}

module.exports = {
  registerCache,
  initCache,
  getCache,
};
