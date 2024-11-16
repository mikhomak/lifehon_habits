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

type create_user_psql struct {
	Email string
	Name string
	Display_name string
	Created_at time.Time
	Public_profile bool
}

func FindUser(user_name string, db *sqlx.DB) (*user_psql_model, error){
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

func CreateUser(user *create_user_psql, db *sqlx.DB) (*user_psql_model, error){
	User := user_psql_model{}
	err := db.Get(&User, `
			INSERT INTO lh_user (email, name, display_name, public_profle)	
			VALUES($1, $2, $3, $4)`, )
	if err != nil {
		return nil, err
	}
	return &User, err
}
