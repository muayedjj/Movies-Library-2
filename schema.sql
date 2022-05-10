DROP TABLE IF EXISTS movrev;

CREATE TABLE IF NOT EXISTS movrev (
    id SERIAL PRIMARY KEY,
    title varchar(255),
    runtime varchar(255),
    summary varchar(255)
);