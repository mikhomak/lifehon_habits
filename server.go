package main

import (
	"lifehon_habits/graph"
	"lifehon_habits/hapi"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

const defaultPort = "8080"

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Cannot load .env")
	}

	dsn := os.Getenv("DATABASE_URL")
	db, db_err := sqlx.Connect("postgres", dsn)
	if db_err != nil {
		log.Printf("%s", db_err)
		panic("Cannot connect to database")
	}
	defer db.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	ctx := &hapi.Context{Db: db}

	router := chi.NewRouter()
	router.Use(graph.Middleware(ctx))

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{DB: db}}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
