import { Pool, type QueryConfig, type QueryConfigValues } from 'pg'
 
const pool = new Pool()
 
export const query = (text : QueryConfig | string, params?: QueryConfigValues<String> | string[]) => {
  return pool.query(text, params)
}


export const getClient = async () => {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
  }, 5000)
  // monkey patch the query method to keep track of the last query executed
  client.release = () => {
    // clear our timeout
    clearTimeout(timeout)
    // set the methods back to their old un-monkey-patched version
    client.query = query
    client.release = release
    return release.apply(client)
  }
  return client
}