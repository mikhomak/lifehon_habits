import { Pool, type QueryConfig, type QueryConfigValues } from 'pg'
 
const pool = new Pool()
 
export const query = (text : QueryConfig | string, params?: QueryConfigValues<String>) => {
  return pool.query(text, params)
}