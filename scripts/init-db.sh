#! /bin/bash

docker run \
	--name lifehon_habbits \
	-e POSTGRES_USER=lifehon_habbits \
	-e POSTGRES_PASSWORD=password \
	-e POSTGRES_DB=lifehon_habbits \
	-p 4322:5432 \
	-d postgres:alpine
