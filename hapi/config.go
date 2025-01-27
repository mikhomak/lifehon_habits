package hapi

import (
	"github.com/jmoiron/sqlx"
)


type Context struct {
	Db *sqlx.DB
}
