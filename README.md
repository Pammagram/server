# Building in Docker

Create `.env.development` file with required credentials

Build project
`docker compose -f docker-compose.dev.yml --env-file=.env.development build`

Run
`docker compose -f docker-compose.dev.yml --env-file=.env.development up`
