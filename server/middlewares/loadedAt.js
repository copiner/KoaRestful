// loadedAt.js
const loadedAtPlugin = function(schema, options){
  schema.virtual('loadedAt').
    get(function() { return this._loadedAt; }).
    set(function(v) { this._loadedAt = v; });

  schema.post(['find', 'findOne'], function(docs) {
    if (!Array.isArray(docs)) {
      docs = [docs];
    }

    const now = new Date();
    for (const doc of docs) {
      doc.loadedAt = now;
    }

  });
};

export default loadedAtPlugin;//export instance
