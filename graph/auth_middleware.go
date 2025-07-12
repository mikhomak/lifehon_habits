package graph

import (
	"lifehon_habits/hapi"
	"net/http"
)

func Middleware(ctx *hapi.Context) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			//	header := r.Header.Get("Authorization")

			next.ServeHTTP(w, r)
		})
	}
}
