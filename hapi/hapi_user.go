package hapi

import(
	"time"
	"log"
	"lifehon_habits/psql_models"
	"encoding/json"
	//"fmt"
	"net/http"
)

type CreateUser struct {
	Email string `json:"email"`
	Name  string    `json:"name"`
	Display_name  string    `json:"display_name"`
	Public_profile  bool    `json:"public_profile"`
}


func (ctx *Context) CreateUser(w http.ResponseWriter, req *http.Request) {
	var create_user_input CreateUser
	err := json.NewDecoder(req.Body).Decode(&create_user_input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	create_user_psql := &psql_models.Create_user_psql{
		Email: create_user_input.Email,
		Name: create_user_input.Name,
		Display_name: create_user_input.Display_name,
		Created_at: time.Now(),
		Public_profile: create_user_input.Public_profile}


	_, err_db := psql_models.CreateUser(create_user_psql, ctx.Db)

	if err_db != nil {
		log.Printf("Error")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	http.StatusText(202)
	log.Printf("User has been created!")
}



