package graph

//go:generate go run github.com/99designs/gqlgen generate
import (
	"github.com/jmoiron/sqlx"
)

type Resolver struct {
	DB *sqlx.DB
}
