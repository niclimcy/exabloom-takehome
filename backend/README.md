# backend

## Requirements

- Docker
- > 500mb of RAM available

## Run server

```sh
docker compose up --build
```

## Populate databases with 10k contacts and 5m messages

Command line:

```sh
curl http://localhost:3000/api/v1/setup/db
curl http://localhost:3000/api/v1/setup/populate
```

OR

API Client / Browser:

```
[GET] localhost:3000/api/v1/setup/db
[GET] localhost:3000/api/v1/setup/populate
```

## Assumptions

- Contact name search is not implemented as it is not in the original schema
- Additional parameter, type, to differentiate between filter type on search route
- Contact number is well formatted like `+6591234567` with + and country code using faker data
- Searching route is paginated as well

## Key Design Decisions

- Added postgres full text search using vectors for message content (vector generation is set to english only for now)
- Indexing of frequently accessed columns on contact and message tables
- Worker thread for data population as it takes super long to generate data
- Using pg-promise insert helper to batch insert 50000 messages per batch
- Docker for easy replication of this app's environment
