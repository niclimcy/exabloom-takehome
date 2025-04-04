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
