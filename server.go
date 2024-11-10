package main

import (
	"lifehon_habits/graph"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"github.com/jmoiron/sqlx"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
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
		panic("Cannot connect to database")
	}



	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{DB: db}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
