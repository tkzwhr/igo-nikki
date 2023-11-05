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

create table analysis
(
    id          serial
        constraint analysis_pk
            primary key,
    record_id   integer          not null
        references records (id),
    turn_number integer          not null,
    move        varchar(2)       not null,
    visits      integer          not null,
    winrate     double precision not null,
    score_lead  double precision not null,
    prior       double precision not null,
    utility     double precision not null
);

create index on analysis(record_id);

create table analysis_jobs
(
    id            serial
        constraint analyzing_status_pk
            primary key,
    record_id     integer not null unique
        references records (id),
    started_at    timestamp,
    finished_at   timestamp,
    error_message varchar(255)
);

create index on analysis_jobs(record_id);
