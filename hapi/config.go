package hapi

import (
	"github.com/jmoiron/sqlx"
)

type User struct {
	id   string
	name string
}

type Context struct {
	Db   *sqlx.DB
	User *User
}
