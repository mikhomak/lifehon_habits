create TABLE "lh_site_configuration"
(
	id SERIAL, 
	active BOOL NOT NULL default true,
	allow_exp BOOL NOT NULL default true,
	lifehon_api_key VARCHAR(254) NOT NULL,
	lifehon_url VARCHAR(254) NOT NULL,
	lifehon_url_login VARCHAR(254) NOT NULL,
	max_habbits INTEGER NOT NULL,
	max_columns INTEGER NOT NULL,
	PRIMARY KEY(id)
);

insert into lh_site_configuration
values (1, true, true, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6InBsYW50c3MifQ.EQJZdd0SvXiVAj6vJsVr4RDq35GtXIimAuMFmCoZt9U', 'http://localhost:8600/api/v1','/user/login/token', 20, 5);

create TABLE "lh_board"
(
	id SERIAL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	user_id INTEGER NOT NULL,
	PRIMARY KEY(id)
);

create TABLE "lh_board_column"
(
	board_id INTEGER NOT NULL REFERENCES "lh_board" (id),
	name VARCHAR(50) NOT NULL,
	user_id VARCHAR(255) NOT NULL,
	position INTEGER NOT NULL UNIQUE,
	PRIMARY KEY(board_id, name)
);


create TABLE "lh_habbit"
(
	id SERIAL,
	name VARCHAR(50) NOT NULL,
	user_id VARCHAR(255) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	positive bool NOT NULL DEFAULT TRUE,
	counter BIGINT NOT NULL DEFAULT 0,
	board_id INTEGER NOT NULL REFERENCES "lh_board" (id),
	column_name VARCHAR(50) NOT NULL,
	foreign KEY(board_id, column_name) REFERENCES "lh_board_column" (board_id, name),
	PRIMARY KEY(id, user_id)
);

create TABLE "lh_task"
(
	id SERIAL,
	name VARCHAR(50) NOT NULL,
	user_id VARCHAR(255) NOT NULL,
	finished bool NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	finished_at TIMESTAMPTZ,
	due_to TIMESTAMPTZ,
	board_id INTEGER NOT NULL REFERENCES "lh_board" (id),
	column_name VARCHAR(50) NOT NULL,
	foreign KEY(board_id, column_name) REFERENCES "lh_board_column" (board_id, name),
	PRIMARY KEY(id, user_id)
);

create TABLE "lh_habbit_tracker"
(
	task_id integer NOT NULL,
	user_id VARCHAR(255) NOT NULL,
	counter BIGINT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	foreign KEY(task_id, user_id) REFERENCES "lh_task" (id, user_id),
	PRIMARY KEY(task_id, counter)
);

create TABLE "lh_tag"
(
	name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	user_id_created VARCHAR(255) NOT NULL,
	PRIMARY KEY(name)
);

create TABLE "lh_task_2_tag"
(
	task_id integer NOT NULL,
	user_id VARCHAR(255) NOT NULL,
	tag_name VARCHAR(50) NOT NULL REFERENCES "lh_tag" (name),
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	foreign KEY(task_id, user_id) REFERENCES "lh_task" (id, user_id)
);


create TABLE IF NOT EXISTS "lh_habbit_2_tag"
(
	habbit_id integer NOT NULL,
	user_id VARCHAR(255) NOT NULL,
	tag_name VARCHAR(50) NOT NULL REFERENCES "lh_tag" (name),
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	foreign KEY(habbit_id, user_id) REFERENCES "lh_habbit" (id, user_id)
);
