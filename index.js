const poolCreator = require('async-functions-pool');
const fetch = require('node-fetch');

const getResource = (url, id, headers) => 
  fetch(url+id, { headers })
  .then(res => res.status == 200 && res.json());
  
const createResource = (url, body, headers) => 
  fetch(url, {
    method: 'POST', 
    headers,
    body: JSON.stringify(body)
  }).then(res => res.status == 201 && res.json());

const createMigrateResourceFunction = processResource => async (source, target, id) => {
  const resource = await getResource(source.url, id, source.headers);
  const response = resource ? await createResource(target.url, processResource  ? processResource(resource) : resource, target.headers) 
                            : false;
  return { resource, response };
}

const idGeneratorList = function*(ids) {
  for(id of ids){
    yield( id );
  }
}

const idGeneratorRange = function*(ids) {
  for(let numericId = ids.from; numericId < ids.to; numericId++ ){
      yield( (ids.prefix || '' ) + numericId);
  }
}

const idGenerator = ids => Array.isArray(ids) ? idGeneratorList(ids) : idGeneratorRange(ids);

const prepare = async (pool, source, target, migrateResource, idGenerator) => {
  for (const id of idGenerator){
    pool.add(() => migrateResource(source, target, id));
  }
}

module.exports = () => {
  const pool = poolCreator();
  return {
    add: migration => prepare(
      pool,
      migration.source,
      migration.target, 
      createMigrateResourceFunction(migration.process),
      idGenerator(migration.ids)
    ),
    run: async parallel => await pool.run(parallel)
  }
}
