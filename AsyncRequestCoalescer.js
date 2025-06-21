// AsyncRequestCoalescer.js

export default class AsyncRequestCoalescer {
  constructor() {
    this.promises = new Map();
  }

  /**
   * Coalesce async requests by key.
   * If a request with the same key is already in progress, returns the existing promise.
   * Otherwise, calls asyncFunc and stores the promise.
   * @param {string} key
   * @param {() => Promise<any>} asyncFunc
   * @returns {Promise<any>}
   */
  coalesce(key, asyncFunc) {
    if (this.promises.has(key)) {
      return this.promises.get(key);
    }
    const promise = asyncFunc()
      .finally(() => {
        this.promises.delete(key);
      });
    this.promises.set(key, promise);
    return promise;
  }
}

// Test simple à lancer avec : node AsyncRequestCoalescer.js
if (process.argv[1].endsWith('AsyncRequestCoalescer.js')) {
  console.log('Test AsyncRequestCoalescer démarré...');

  (async () => {
    const coalescer = new AsyncRequestCoalescer();

    const p1 = coalescer.coalesce('key1', async () => {
      console.log('Lancement de la requête 1...');
      await new Promise(r => setTimeout(r, 1000));
      return 'résultat 1';
    });

    const p2 = coalescer.coalesce('key1', async () => {
      console.log('Lancement de la requête 2...');
      await new Promise(r => setTimeout(r, 1000));
      return 'résultat 2';
    });

    const results = await Promise.all([p1, p2]);
    console.log('Résultats des deux requêtes coalescées :', results);
    // Devrait afficher ['résultat 1', 'résultat 1'] car la 2ème est coalescée
  })();
}
