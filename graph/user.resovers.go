package graph

import (
	"context"
	"lifehon_habits/graph/model"
	"lifehon_habits/psql_models"
)

func (r *queryResolver) User(ctx context.Context, userName string) (*model.User, error) {
	user_psql, err := psql_models.FindUser(r.DB, userName)
	if err != nil {
		return nil, err
	}

	return &model.User{
		ID: user_psql.Email,
		Name: user_psql.Name,
	}, nil
}