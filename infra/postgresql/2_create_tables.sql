\c igo_nikki

create table users
(
    id   varchar(64)
        constraint users_pk
            primary key,
    name varchar(32) not null
);

create table records
(
    id           serial
        constraint records_pk
            primary key,
    owned_by     varchar(64) not null
        references users (id),
    sgf_text     text        not null,
    player_color varchar(5)  not null
);

create index on records(owned_by);
