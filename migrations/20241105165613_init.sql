create TABLE "lh_site_configuration"
(
	id SERIAL PRIMARY KEY,
	active BOOL NOT NULL default true,
	allow_exp BOOL NOT NULL default true
);

insert into lh_site_configuration
values (1, true, true);


create TABLE "lh_user"
(
	email VARCHAR(254) NOT NULL UNIQUE,
	name VARCHAR(50) NOT NULL UNIQUE,
	display_name VARCHAR(50) NOT NULL UNIQUE,
	createad_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	public_profile bool NOT NULL DEFAULT TRUE,
	PRIMARY KEY (name)
);

create TABLE "lh_habbit"
(
	id SERIAL NOT NULL
	name VARCHAR(50) NOT NULL,
	user_name VARCHAR(50) NOT NULL REFERENCES "lh_uesr" (name),
	createad_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	positive bool NOT NULL DEFAULT TRUE,
	counter BIGINT NOT NULL DEFAULT 0,
	PRIMARY KEY(id, user_name)
);

create TABLE "lh_task"
(
	id SERIAL NOT NULL
	name VARCHAR(50) NOT NULL,
	user_name VARCHAR(50) NOT NULL REFERENCES "lh_uesr" (name),
	finished bool NOT NULL DEFAULT false,
	createad_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	finished_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW'::timestamptz,
	PRIMARY KEY(id, user_name)
);
