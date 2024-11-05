package graph

import (
	"context"
	"lifehon_habits/graph/model"
)

func (r *habbitResolver) Name(ctx context.Context, obj *model.Habbit) (string, error) {
	return "heheeheheh", nil
}
