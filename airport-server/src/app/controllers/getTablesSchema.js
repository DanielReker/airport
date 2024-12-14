const {knex} = require("../database");

const toSentenceCase = str => {
    const s =
        str &&
        str
            .match(
                /[A-Z]{2,}(?=[A-Z][a-z,]+[0-9]*|\b)|[A-Z]?[a-z,]+[0-9]*|[A-Z]|[0-9]+/g
            )
            .join(' ');
    return s.slice(0, 1).toUpperCase() + s.slice(1);
};

const prettifyString = str => {
    return toSentenceCase(str
        .replace('_kg', ',_kg')
        .replace('_km', ',_km')
    )
        .replace('id', 'ID')
        .replace('Id', 'ID')
        .replace('Iata', 'IATA')
        .replace('Icao', 'ICAO')
        .replace('iata', 'IATA')
        .replace('icao', 'ICAO');
};

const getDataTypeFromDbType = (dbType) => {
    const dbTypeToDataType = {
        'numeric': 'number',
        'integer': 'number',
        'bigint': 'number',
        'double precision': 'number',
        'timestamp with time zone': 'dateTime',
    };
    if (dbType in dbTypeToDataType) return dbTypeToDataType[dbType];
    else return 'string';
};

module.exports = async () => {
    const rawColumns = await knex.withSchema('information_schema').select(
        'columns.table_name',
        'columns.column_name',
        'columns.column_default',
        'columns.is_nullable',
        'columns.data_type',
        'tables.table_type',
        'columns.ordinal_position'
    ).from('columns')
        .join('tables', 'columns.table_name', '=', 'tables.table_name')
        .where('columns.table_schema', 'domain');

    let tables = {};

    for (const rawColumnId in rawColumns) {
        const rawColumn = rawColumns[rawColumnId];

        if (!tables[rawColumn['table_name']]) {
            tables[rawColumn['table_name']] = {
                name: rawColumn['table_name'],
                printableName: prettifyString(rawColumn['table_name']),
                type: rawColumn['table_type'] === 'VIEW' ? 'view' : 'table',
                columns: {},
            };
        }

        tables[rawColumn['table_name']].columns[rawColumn['column_name']] = {
            name: rawColumn['column_name'],
            printableName: prettifyString(rawColumn['column_name']),
            position: rawColumn['ordinal_position'],
            default: rawColumn['column_default'],
            isNullable: rawColumn['is_nullable'] === 'YES',
            dataType: getDataTypeFromDbType(rawColumn['data_type']),
        };
    }

    return tables;
};