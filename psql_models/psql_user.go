package psql_models

import(
	"time"
	"log"
	"github.com/jmoiron/sqlx"
)

type user_psql_model struct {
	Email string
	Name string
	Display_name string
	Created_at time.Time
	Public_profile bool
}

type Create_user_psql struct {
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
	return &User, nil
}

func CreateUser(user *Create_user_psql, db *sqlx.DB) (*user_psql_model, error){
	User := user_psql_model{}
	err := db.Get(&User, `
			INSERT INTO lh_user (email, name, display_name, public_profile)	
			VALUES($1, $2, $3, $4)
			RETURNING email, name, display_name, created_at, public_profile`, user.Email, user.Name, user.Display_name, user.Public_profile)
	if err != nil {
		log.Printf("there was an error during the creation of the user. the error is [%s]", err.Error())
		return nil, err
	}
	log.Printf("User [%s] has been created!", User.email)
	return &User, nil
}
