package psql_models

import (

	"github.com/jmoiron/sqlx"
)

type site_configuration_psql_model struct {
	Id int64
	Active bool
	Allow_exp bool
	Lifehon_api_key string
}


func getSiteConfiguration(db *sqlx.DB) (*site_configuration_psql_model, error){
	SiteConfiguration := site_configuration_psql_model {}
	err := db.Get(&SiteConfiguration, `
		select sc.id, sc.active, sc.allow_exp, sc.lifehon_api_key
		from lh_site_configuration
		limit 1`)
	if err != nil{
		return nil, err
	}
	return &SiteConfiguration, nil

}
