\c igo_nikki

create table users
(
    id       serial
        constraint users_pk
            primary key,
    name     varchar(32) not null
);
