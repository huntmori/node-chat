create table user_profile
(
    idx        bigint auto_increment
        primary key,
    uid        text                                   null,
    user_uid   text                                   not null,
    nickname   text                                   not null,
    created_at datetime   default current_timestamp() null,
    updated_at datetime   default current_timestamp() null on update current_timestamp(),
    is_active  tinyint(1) default 1                   null,
    is_deleted tinyint(1) default 0                   null,
    deleted_at datetime                               null
);

create table users
(
    id         int auto_increment
        primary key,
    uid        text                                  not null,
    username   varchar(50)                           not null,
    email      varchar(100)                          not null,
    password   varchar(255)                          not null,
    created_at timestamp default current_timestamp() null,
    updated_at timestamp default current_timestamp() null on update current_timestamp(),
    constraint email
        unique (email),
    constraint username
        unique (username)
);

create table messages
(
    id         int auto_increment
        primary key,
    user_id    int                                   not null,
    message    text                                  not null,
    created_at timestamp default current_timestamp() null,
    constraint messages_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create index idx_messages_created_at
    on messages (created_at);

create index idx_messages_user_id
    on messages (user_id);

