create TABLE "lh_site_configuration"
(
	id SERIAL PRIMARY KEY,
	active BOOL NOT NULL default true,
	allow_exp BOOL NOT NULL default true,
	lifehon_api_key VARCHAR(254) NOT NULL
);

insert into lh_site_configuration
values (1, true, true, 'api_key');

create TABLE "lh_user"
(
	email VARCHAR(254) NOT NULL UNIQUE,
	name VARCHAR(50) NOT NULL UNIQUE,
	display_name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	public_profile bool NOT NULL DEFAULT TRUE,
	PRIMARY KEY (name)
);

create TABLE "lh_habbit"
(
	id SERIAL NOT NULL,
	name VARCHAR(50) NOT NULL,
	user_name VARCHAR(50) NOT NULL REFERENCES "lh_user" (name),
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	positive bool NOT NULL DEFAULT TRUE,
	counter BIGINT NOT NULL DEFAULT 0,
	PRIMARY KEY(id, user_name)
);

create TABLE "lh_habbit_tracker"
(
	task_id SERIAL NOT NULL REFERENCES "lh_task" (id),
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
);

create TABLE "lh_task"
(
	id SERIAL NOT NULL,
	name VARCHAR(50) NOT NULL,
	user_name VARCHAR(50) NOT NULL REFERENCES "lh_user" (name),
	finished bool NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	finished_at TIMESTAMPTZ,
	due_to TIMESTAMPTZ,
	PRIMARY KEY(id, user_name)
);

create TABLE "lh_tag"
(
	name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	user_created VARCHAR(50) NOT NULL REFERENCES "lh_user" (name),
	PRIMARY KEY(name)
);

create TABLE "lh_task_2_tag"
(
	task_id SERIAL NOT NULL REFERENCES "lh_task" (id),
	tag_name VARCHAR(50) NOT NULL REFERENCES "lh_tag" (name),
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
);


create TABLE "lh_habbit_2_tag"
(
	habbit_id SERIAL NOT NULL REFERENCES "lh_habbit" (id),
	tag_name VARCHAR(50) NOT NULL REFERENCES "lh_tag" (name),
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
);

create TABLE "lh_board"
(
	id SERIAL NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	user VARCHAR(50) NOT NULL REFERENCES "lh_user" (name),
);

create TABLE "lh_board_column"
(
	board_id SERIAL NOT NULL REFERENCES "lh_board" (id),
	tag_name VARCHAR(50) NOT NULL REFERENCES "lh_tag" (name),
);
