package main

import (
	"lifehon_habits/graph"
	hapi "lifehon_habits/hapi"
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
		log.Printf("%s", db_err)
		panic("Cannot connect to database")
	}
	defer db.Close()



	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	ctx := &hapi.Context{Db: db}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{DB: db}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)
	http.HandleFunc("/user", ctx.CreateUser)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
