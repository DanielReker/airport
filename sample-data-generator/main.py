import string
from datetime import datetime
import json
import random


def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


first_names = [ 'Ivan', 'Petr', 'Vasiliy', 'Alexander', 'Nikolay', 'Alexey', 'Ilya', 'Vadim', 'Vladimir', 'Dmitry' ]
last_names = [ 'Ivanov', 'Petrov', 'Vasiliev', 'Alexandrov', 'Nikolaev', 'Alexeev', 'Ilyin', 'Dmitriev', 'Sidorov' ]
patronymics = [ 'Ivanovich', 'Petrovich', 'Vasilievich', 'Alexandrovich', 'Nikolaevich', 'Alexeevich', 'Ilyich', 'Vadimovich', 'Vladimirovich', 'Dmitrievich' ]
job_positions = [ 'Pilot', 'Co-pilot', 'Flight engineer', 'Steward', 'Traffic controller' ]



airports = read_json('airports.json')
aircraft_models = read_json('aircraft_models.json')
routes = read_json('routes.json')
aircrafts = read_json('aircrafts.json')
flights = read_json('flights.json')
personnel = read_json('personnel.json')


def generate_random_aircrafts(n):
    for i in range(n):
        aircraft_model = aircraft_models[random.randint(0, len(aircraft_models) - 1)]
        airport = airports[random.randint(0, len(airports) - 1)]
        print(f"({aircraft_model['model_id']}, '{airport['icao_code']}', {random.randint(1970, 2000)}),")

def generate_random_routes(n):
    for i in range(n):
        airport_from = airports[random.randint(0, len(airports) - 1)]
        airport_to = airports[random.randint(0, len(airports) - 1)]
        while airport_from == airport_to:
            airport_to = airports[random.randint(0, len(airports) - 1)]

        print(f"('{airport_from['icao_code']}', '{airport_to['icao_code']}', {round(random.uniform(500.0, 10000.0), 3)}),")


def random_date():
    return datetime.fromtimestamp(random.uniform(1577822400, 1732197937)).strftime("'%Y-%m-%d %H:%M:%S+00'")

def generate_random_flights(n):
    for i in range(n):
        scheduled_departure_time = random_date()
        scheduled_arrival_time = random_date()
        actual_departure_time = random_date()
        actual_arrival_time = random_date()

        aircraft = aircrafts[random.randint(0, len(aircrafts) - 1)]
        route = routes[random.randint(0, len(routes) - 1)]

        aircraft_model = None
        for aircraft_model_iterated in aircraft_models:
            if aircraft_model_iterated['model_id'] == aircraft['model_id']:
                aircraft_model = aircraft_model_iterated

        if random.uniform(0, 1) < 0.2:
            actual_arrival_time = 'NULL'
            if random.uniform(0, 1) < 0.5:
                actual_departure_time = 'NULL'


        passengers_number = random.randint(1, aircraft_model['seats_number'] or 2)
        load_kg = random.randint(1, aircraft_model['load_capacity_kg'] or 500)

        print(f"({aircraft['aircraft_id']}, {route['route_id']}, {scheduled_departure_time}, {scheduled_arrival_time}, {actual_departure_time}, {actual_arrival_time}, {passengers_number}, {load_kg}),")


def generate_random_number_str(len):
    return ''.join(random.choice(string.digits) for _ in range(len))


def generate_random_personnel(n):
    for i in range(n):
        first_name = f"'{first_names[random.randint(0, len(first_names) - 1)]}'"
        last_name = f"'{last_names[random.randint(0, len(last_names) - 1)]}'"
        patronymic = 'NULL' if random.uniform(0, 1) < 0.1 else f"'{patronymics[random.randint(0, len(patronymics) - 1)]}'"
        job_position = f"'{job_positions[random.randint(0, len(job_positions) - 1)]}'"

        passport_series = generate_random_number_str(4)
        passport_number = generate_random_number_str(6)
        inn = generate_random_number_str(12)

        airport = airports[random.randint(0, len(airports) - 1)]

        salary = random.randint(30000, 500000)
        print(f"('{passport_series}', '{passport_number}', '{inn}', {first_name}, {last_name}, {patronymic}, {job_position}, {salary}.00, '{airport['icao_code']}'),")

def generate_random_flight_crews(n):
    for i in range(n):
        person = personnel[random.randint(0, len(personnel) - 1)]
        flight = flights[random.randint(0, len(flights) - 1)]

        print(f"({flight['flight_id']}, '{person['passport_series']}', '{person['passport_number']}'),")


generate_random_flight_crews(300)



