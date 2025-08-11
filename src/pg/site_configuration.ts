import * as db from './pg_index'
export type pg_SiteConfiguration = {
	active: boolean;
	allow_exp: boolean;
	lifehon_api_key: string;
	lifehon_url: string;
	lifehon_url_login: string;
	max_habbits: number;
	max_columns: number;

};

export async function getSiteConfiguration() : Promise<pg_SiteConfiguration>{
	const {rows} = await db.query('SELECT * FROM lh_site_configuration');

	return rows[0] as pg_SiteConfiguration;
};

