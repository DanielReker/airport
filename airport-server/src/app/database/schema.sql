CREATE SCHEMA domain;


CREATE TABLE domain.airports (
	id serial UNIQUE,
	icao_code varchar(4) PRIMARY KEY CHECK (icao_code ~ '[A-Z]{4}'),
	iata_code varchar(3) UNIQUE CHECK (iata_code ~ '[A-Z]{3}'),
	airport_name text,
	address text,
	latitude double precision NOT NULL,
	longitude double precision NOT NULL
);
CREATE INDEX ON domain.airports (airport_name);

CREATE TABLE domain.aircraft_models (
	id serial PRIMARY KEY,
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
	id serial PRIMARY KEY,
	model_id integer NOT NULL REFERENCES domain.aircraft_models ON UPDATE CASCADE ON DELETE CASCADE,
	base_airport varchar(4) REFERENCES domain.airports ON UPDATE CASCADE ON DELETE CASCADE,
	year_manufactured numeric(4) CHECK (year_manufactured > 1900 AND year_manufactured < 2100)
);
CREATE INDEX ON domain.aircrafts (model_id);

CREATE TABLE domain.personnel (
	id serial UNIQUE,
	passport_series varchar(4) CHECK (passport_series ~ '[0-9]{4}'),
	passport_number varchar(6) CHECK (passport_number ~ '[0-9]{6}'),
	inn varchar(12) NOT NULL UNIQUE CHECK (inn ~ '[0-9]{12}'),
	first_name text NOT NULL,
	last_name text NOT NULL,
	patronymic text,
	job_position text NOT NULL,
	salary numeric(20, 2),
	airport_code varchar(4) NOT NULL REFERENCES domain.airports ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (passport_series, passport_number)
);
CREATE INDEX ON domain.personnel (salary);

CREATE TABLE domain.routes (
	id serial PRIMARY KEY,
	from_airport_icao varchar(4) NOT NULL REFERENCES domain.airports ON UPDATE CASCADE ON DELETE CASCADE,
	to_airport_icao varchar(4) NOT NULL REFERENCES domain.airports ON UPDATE CASCADE ON DELETE CASCADE,
	distance_km numeric(8, 3) CHECK (distance_km > 0),
	CHECK (from_airport_icao <> to_airport_icao),
	UNIQUE (from_airport_icao, to_airport_icao)
);
CREATE INDEX ON domain.routes (from_airport_icao);
CREATE INDEX ON domain.routes (to_airport_icao);
CREATE INDEX ON domain.routes (distance_km);

CREATE TABLE domain.flights (
	id serial PRIMARY KEY,
	aircraft_id integer NOT NULL REFERENCES domain.aircrafts ON UPDATE CASCADE ON DELETE CASCADE,
	route_id integer NOT NULL REFERENCES domain.routes ON UPDATE CASCADE ON DELETE CASCADE,
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
	id serial UNIQUE,
	flight_id integer REFERENCES domain.flights ON UPDATE CASCADE ON DELETE CASCADE,
	passport_series varchar(4),
	passport_number varchar(6),
	FOREIGN KEY (passport_series, passport_number)
		REFERENCES domain.personnel (passport_series, passport_number) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (flight_id, passport_series, passport_number)
);

CREATE OR REPLACE VIEW domain.airport_aircrafts_count AS
	SELECT
		ap.id,
    	ap.iata_code AS iata_code,
    	ap.airport_name AS airport_name,
    	count(*) AS planes_number
    FROM domain.airports ap
    LEFT JOIN domain.aircrafts ac ON ap.icao_code = ac.base_airport
    GROUP BY ap.id, ap.iata_code, ap.airport_name
    ORDER BY planes_number DESC;

CREATE OR REPLACE VIEW domain.aircraft_utilization AS
    SELECT
        am.id,
        concat(am.manufacturer, ' ', am.model_name) AS model,
        count(f.id) AS total_flights,
        sum(f.passengers_number) AS total_passengers,
        sum(f.load_kg) AS total_load
    FROM domain.aircraft_models am
    LEFT JOIN domain.aircrafts a ON am.id = a.model_id
    LEFT JOIN domain.flights f ON a.id = f.aircraft_id
    GROUP BY am.id, am.manufacturer, am.model_name
    ORDER BY total_flights DESC;

CREATE OR REPLACE VIEW domain.job_positions_statistics AS
    SELECT
        row_number() OVER () AS id,
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
        r.id,
        r.from_airport_icao,
        r.to_airport_icao,
        count(f.id) AS total_flights,
        avg(f.passengers_number) AS average_passengers,
        avg(f.load_kg) AS average_load_kg
    FROM domain.routes r
    LEFT JOIN domain.flights f ON r.id = f.route_id
    GROUP BY r.id, r.from_airport_icao, r.to_airport_icao
    ORDER BY total_flights DESC;



CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 double precision, lon1 double precision,
    lat2 double precision, lon2 double precision
) RETURNS numeric AS $$
DECLARE
    earth_radius_km numeric := 6378.1370; -- Earth's radius in kilometers
    dlat numeric := radians(lat2 - lat1);
    dlon numeric := radians(lon2 - lon1);
    a numeric;
    c numeric;
BEGIN
    a := sin(dlat / 2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)^2;
    c := 2 * atan2(sqrt(a), sqrt(1 - a));
    RETURN earth_radius_km * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


CREATE OR REPLACE FUNCTION update_route_distance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE domain.routes
    SET distance_km = calculate_distance(
        NEW.latitude, NEW.longitude,
        ap_to.latitude, ap_to.longitude
    )
    FROM domain.airports ap_to
    WHERE domain.routes.from_airport_icao = NEW.icao_code
      AND domain.routes.to_airport_icao = ap_to.icao_code;

    UPDATE domain.routes
    SET distance_km = calculate_distance(
        ap_from.latitude, ap_from.longitude,
        NEW.latitude, NEW.longitude
    )
    FROM domain.airports ap_from
    WHERE domain.routes.to_airport_icao = NEW.icao_code
      AND domain.routes.from_airport_icao = ap_from.icao_code;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER airport_coordinates_update
AFTER UPDATE OF latitude, longitude ON domain.airports
FOR EACH ROW
EXECUTE FUNCTION update_route_distance();


CREATE OR REPLACE FUNCTION calculate_new_route_distance()
RETURNS TRIGGER AS $$
DECLARE
    lat1 double precision;
    lon1 double precision;
    lat2 double precision;
    lon2 double precision;
BEGIN
    SELECT latitude, longitude INTO lat1, lon1
    FROM domain.airports
    WHERE icao_code = NEW.from_airport_icao;

    SELECT latitude, longitude INTO lat2, lon2
    FROM domain.airports
    WHERE icao_code = NEW.to_airport_icao;

    NEW.distance_km := calculate_distance(lat1, lon1, lat2, lon2);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER route_airports_update
BEFORE UPDATE OF from_airport_icao, to_airport_icao ON domain.routes
FOR EACH ROW
EXECUTE FUNCTION calculate_new_route_distance();

CREATE OR REPLACE TRIGGER route_insert_distance
BEFORE INSERT ON domain.routes
FOR EACH ROW
EXECUTE FUNCTION calculate_new_route_distance();

