CREATE SCHEMA domain;


CREATE TABLE domain.airports (
	icao_code varchar(4) PRIMARY KEY CHECK (icao_code ~ '[A-Z]{4}'),
	iata_code varchar(3) UNIQUE CHECK (iata_code ~ '[A-Z]{3}'),
	airport_name text,
	address text,
	latitude double precision,
	longitude double precision
);
CREATE INDEX ON domain.airports (airport_name);

CREATE TABLE domain.aircraft_models (
	model_id serial PRIMARY KEY,
	manufacturer text NOT NULL,
	model_name text NOT NULL,
	iata_code varchar(3) UNIQUE CHECK (iata_code ~ '[A-Z0-9]{3}'),
	seats_number integer NOT NULL DEFAULT 0 CHECK (seats_number >= 0),
	load_capacity_kg integer CHECK (load_capacity_kg > 0),
	CONSTRAINT unique_model UNIQUE (manufacturer, model_name)
);
CREATE INDEX ON domain.aircraft_models (seats_number);
CREATE INDEX ON domain.aircraft_models (load_capacity_kg);

CREATE TABLE domain.aircrafts (
	aircraft_id serial PRIMARY KEY,
	model_id integer NOT NULL REFERENCES domain.aircraft_models,
	base_airport varchar(4) REFERENCES domain.airports,
	year_manufactured numeric(4) CHECK (year_manufactured > 1900 AND year_manufactured < 2100)
);
CREATE INDEX ON domain.aircrafts (model_id);

CREATE TABLE domain.personnel (
	passport_series varchar(4) CHECK (passport_series ~ '[0-9]{4}'),
	passport_number varchar(6) CHECK (passport_number ~ '[0-9]{6}'),
	inn varchar(12) NOT NULL UNIQUE CHECK (inn ~ '[0-9]{12}'),
	first_name text NOT NULL,
	last_name text NOT NULL,
	patronymic text,
	job_position text NOT NULL,
	salary numeric(20, 2),
	airport_code varchar(4) NOT NULL REFERENCES domain.airports,
	PRIMARY KEY (passport_series, passport_number)
);
CREATE INDEX ON domain.personnel (salary);

CREATE TABLE domain.routes (
	route_id serial PRIMARY KEY,
	from_airport_icao varchar(4) NOT NULL REFERENCES domain.airports,
	to_airport_icao varchar(4) NOT NULL REFERENCES domain.airports,
	distance_km numeric(8, 3) NOT NULL CHECK (distance_km > 0),
	CHECK (from_airport_icao <> to_airport_icao)
);
CREATE INDEX ON domain.routes (from_airport_icao);
CREATE INDEX ON domain.routes (to_airport_icao);
CREATE INDEX ON domain.routes (distance_km);

CREATE TABLE domain.flights (
	flight_id serial PRIMARY KEY,
	aircraft_id integer NOT NULL REFERENCES domain.aircrafts,
	route_id integer NOT NULL REFERENCES domain.routes,
	scheduled_departure_time timestamptz NOT NULL,
	scheduled_arrival_time timestamptz NOT NULL,
	actual_departure_time timestamptz,
	actual_arrival_time timestamptz,
	passengers_number integer NOT NULL DEFAULT 0 CHECK (passengers_number >= 0),
	load_kg integer CHECK (load_kg > 0)
);
CREATE INDEX ON domain.flights (scheduled_arrival_time);
CREATE INDEX ON domain.flights (scheduled_departure_time);

CREATE TABLE domain.flight_crews (
	flight_id integer REFERENCES domain.flights,
	passport_series varchar(4),
	passport_number varchar(6),
	FOREIGN KEY (passport_series, passport_number)
		REFERENCES domain.personnel (passport_series, passport_number),
	PRIMARY KEY (flight_id, passport_series, passport_number)
);

CREATE OR REPLACE VIEW domain.airport_aircrafts_count AS
	SELECT
    	ap.iata_code AS iata_code,
    	ap.airport_name AS airport_name,
    	count(*) AS planes_number
    FROM domain.airports ap
    LEFT JOIN domain.aircrafts ac ON ap.icao_code = ac.base_airport
    GROUP BY ap.iata_code, ap.airport_name
    ORDER BY planes_number DESC;

CREATE OR REPLACE VIEW domain.aircraft_utilization AS
    SELECT
        concat(am.manufacturer, ' ', am.model_name) AS model,
        count(f.flight_id) AS total_flights,
        sum(f.passengers_number) AS total_passengers,
        sum(f.load_kg) AS total_load
    FROM domain.aircraft_models am
    LEFT JOIN domain.aircrafts a ON am.model_id = a.model_id
    LEFT JOIN domain.flights f ON a.aircraft_id = f.aircraft_id
    GROUP BY am.manufacturer, am.model_name
    ORDER BY total_flights DESC;

CREATE OR REPLACE VIEW domain.job_positions_statistics AS
    SELECT
        job_position,
        count(*) AS employees_count,
        sum(salary) AS total_salaries,
        avg(salary) AS average_salary
    FROM domain.personnel
    GROUP BY job_position
    HAVING count(*) > 0
    ORDER BY employees_count DESC;

CREATE OR REPLACE VIEW domain.routes_statistics AS
    SELECT
        r.route_id,
        r.from_airport_icao,
        r.to_airport_icao,
        count(f.flight_id) AS total_flights,
        avg(f.passengers_number) AS average_passengers,
        avg(f.load_kg) AS average_load_kg
    FROM domain.routes r
    LEFT JOIN domain.flights f ON r.route_id = f.route_id
    GROUP BY r.route_id, r.from_airport_icao, r.to_airport_icao
    ORDER BY total_flights DESC;