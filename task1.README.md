# Membership API Modernization Task

## Duration

Total time spent on both task 1 and 2 is **9.5 hours**, I know that I passed time limit, but I had to clean up a bit before pushing task 1, task 1 alone took 8.7 hours, task 2 didn't take much time tbh as I'm well expereienced in desiging systems with exports

## Summary

Working on this task was a blast 🎉! It felt especially rewarding because I haven’t worked with **TypeScript** in the past 6 months, and it's my absolute favorite language ❤️. This challenge gave me a chance to reconnect with it while applying some of my architectural preferences and testing strategies.

---

# Running Project Commands

This project uses a set of handy npm scripts for development, testing, and code generation. Below is a guide on how to use them.

---

## 1. Install packages

```bash
npm i
```

## 2. Generate OpenAPI Schema API

```bash
npm run generate-api
```

## 3. Start the Project

```bash
npm run start
```

Runs the main application using ts-node. Make sure TypeScript and your dependencies are installed first.


## 4. Build the Project

```bash
npm run build
```

### Run All Tests

```bash
npm run test:all
```
Runs all test cases (unit, integration, and e2e) using AVA.
The --fail-fast flag stops on the first failure, and -s ensures the test files are loaded in order.

for specefic test types:
1. To run e2e tests only
```bash
npm run test:e2e
```
2. To run integration tests only
```bash
npm run test:integration
```
3. To run integration tests only
```bash
npm run test:unit
```

## Docker

if you have docker compose installed and docker up and running, you can also run

```bash
docker compose up
```

The default port is `3000`, you can use the [postman collection](./docs//postman/Eversports-task1.postman_collection.json) to test out the APIs.

--- 

## Thought Process

1. **Read the README** thoroughly to understand the legacy system and requirements.
2. **Tested the legacy APIs** using Postman to get a practical feel of the current state.
3. Based on my analysis, I chose to implement a mix of **DDD (Domain-Driven Design)** and **CQRS** to maintain a strict separation of concerns and focus on the domain logic.
4. Installed a **boilerplate** for quicker bootstrapping and set up a clean structure for development.
5. Built **end-to-end test cases** covering all major scenarios to ensure functionality and stability.

---

## Implementation Breakdown

- Started with the `/domain` folder.
- Implemented:
  - Models
  - Controllers
  - Services
  - Routes
  - DTOs
  - Repository and mocked repository (almost the same of corse 😅)
  - OpenApi Schema with UI generation script
- Introduced **CQRS patterns** for command/query separation.
- Wrote test cases with various scenarios
- Added logger

---

## Decisions & Tradeoffs

- **Docker & Postgres**: Initially planned to integrate both, and even left their folders to demonstrate my intent and skills—but due to time constraints, I didn’t fully integrate them.
- **Ports & Adapters (Hexagonal Architecture)**: Also considered, as it would have fit very well with the business logic outlined in the README. However, for the sake of time, I simplified it with DTOs. If I had more time, I definitely would’ve gone this route.
- **Tech choices**:
  - `ava` for testing – chosen due to previous experience.
  - `inversify` for dependency injection – with a handcrafted DI container for simplicity.
  - `pino` for logging – fast and reliable.
  - Would've added `opentelemetry` for logging/tracing if time allowed.
- Initially considered adding **users data** (table or JSON) but architectural planning consumed most of the time.
- I know that is sometimes against company policies, but since no one told me not to, and I want to be 100% honest, I decided to use Claude for some test cases generation as well as writing some comments and the read me files.
- You can find a [generate-keys.sh](./generate-keys.sh) file in the repo, this file simply generate keys that I would have used in JWT if I had a user authentication implemented, I decided to leave it there so you know that I inteded to do waaay more in this task ☺️
- I wanted to have also `.github` actions, but due to the time limitations, decided not to have it

---

## Documentation

* Detailed architectural decisions and structure explanation can be found in [`docs/documentation`](./docs/documentation/architucture-desisions.md).
* [A postman collection](./docs/postman/Eversports-task1.postman_collection.json) and [environment](./docs/postman/EversportEnv.postman_environment.json) can be found, with response examples.

---

## Final Thoughts

This was a super fun project and I really enjoyed applying my backend and architectural skills. Really looking forward to the next steps 🎉 (hopefully)!
