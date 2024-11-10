package psql_models

import(
	"time"

	"github.com/jmoiron/sqlx"
)

type user_psql_model struct {
	Email string
	Name string
	Display_name string
	Created_at time.Time
	Public_profile bool
}

func FindUser(db *sqlx.DB, user_name string) (*user_psql_model, error){
	User := user_psql_model{}
	err := db.Get(&User, `
			select *
			from lh_user
			where name = $1`, user_name)
	if err != nil {
		return nil, err
	}
	return &User, err
}
