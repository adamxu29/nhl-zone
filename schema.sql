-- NHL Zone — database schema
-- Run this in the Supabase SQL editor on a fresh project.

-- ---------------------------------------------------------------- tables

CREATE TABLE teams (
  id          INT PRIMARY KEY,
  abbrev      VARCHAR(3) UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  conference  TEXT,
  division    TEXT
);

CREATE TABLE games (
  id                BIGINT PRIMARY KEY,
  date              DATE NOT NULL,
  season            INT,
  home_team_id      INT REFERENCES teams(id),
  away_team_id      INT REFERENCES teams(id),
  home_score        INT,
  away_score        INT,
  game_state        TEXT,
  game_type         INT,
  game_center_link  TEXT
);

CREATE TABLE players (
  id              INT PRIMARY KEY,
  team_id         INT REFERENCES teams(id),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  position        TEXT,
  jersey_number   INT,
  shoots_catches  TEXT,
  height_inches   INT,
  weight_pounds   INT,
  birth_date      DATE,
  birth_country   TEXT
);

-- ------------------------------------------------------------------ rls

ALTER TABLE teams   ENABLE ROW LEVEL SECURITY;
ALTER TABLE games   ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON teams   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON games   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON players FOR SELECT TO anon, authenticated USING (true);

-- --------------------------------------------------------------- indexes

CREATE INDEX games_home_team_idx ON games (home_team_id);
CREATE INDEX games_away_team_idx ON games (away_team_id);
CREATE INDEX games_date_idx      ON games (date);
CREATE INDEX players_team_idx    ON players (team_id);
