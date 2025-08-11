import { getSiteConfiguration } from "../pg/site_configuration";

export type User = {
  id: string;
  displayName: string;
  publicProfile: boolean;
};
export async function check_token(token: string): Promise<any> {
  const site_configuration = await getSiteConfiguration();
  const url = `${site_configuration.lifehon_url}${site_configuration.lifehon_url_login}`;
  console.log(url);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      hobby: site_configuration.lifehon_api_key,
    },
    body: JSON.stringify({token: token})
  });

  return res.json();
}
