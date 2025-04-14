<!-- # Fullstack Interview Challenge

> [!IMPORTANT]
> You should have received a google doc together with this repository that explains in detail the scope and context of the exercise, together with it's acceptance criteria and any other necessary information for the completion of the challenge.

## Context

You are working in the product team at eversports that is maintaining the eversports manager. You and your team are working on a bunch of features around memberships within the current quarter.

The team also started an initiative in this quarter to modernize the codebase by refactoring features implemented in an old technology stack to a more modern one.

### Domain: Memberships

A `Membership` allows a user to participate at any class the a specific sport venue within a specific timespan. Within this timespan, the membership is divided into `MembershipPeriods`. The MembershipPeriods represent billing periods that the user has to pay for.

For the scope of this exercise, the domain model was reduced to a reasonable size.

#### Entity: Membership

```ts
interface Membership {
  name: string; // name of the membership
  user: number; // the user that the membership is assigned to
  recurringPrice: number; // price the user has to pay for every period
  validFrom: Date; // start of the validity
  validUntil: Date; // end of the validity
  state: string; // indicates the state of the membership
  paymentMethod: string; // which payment method will be used to pay for the periods
  billingInterval: string; // the interval unit of the periods
  billingPeriods: number; // the number of periods the membership has
}
```

#### Entity: MembershipPeriod

```ts
interface MembershipPeriod {
  membership: number; // membership the period is attached to
  start: Date; // indicates the start of the period
  end: Date; // indicates the end of the period
  state: string;
}
```

## Task 1 - Modernization of the membership codebase (backend only)

Before your team can start to implement new features, you guys decided to **modernize the backend codebase** first.

Your task is to **refactor two endpoints** implemented in the **legacy codebase** that can be used to list and create memberships:

GET /legacy/memberships (`src/legacy/routes/membership.routes.js`)
POST /legacy/memberships (`src/legacy/routes/membership.routes.js`)

Your new implementation should be accessible through new endpoints in the **modern codebase** that are already prepared:

GET /memberships (`src/modern/routes/membership.routes.ts`)
POST /memberships (`src/modern/routes/membership.routes.ts`)

When refactoring, you should consider the following aspects:

- The response from the endpoints should be exactly the same. Use the same error messages that are used in the legacy implementation.
- You write read- and maintainable code
- You use Typescript instead of Javascript to enabled type safety
- Your code is separated based on concerns
- Your code is covered by automated tests to ensure the stability of the application

> [!NOTE]
> For the scope of this task, the data used is mocked within the json files `membership.json` and `membership-periods.json`

> [!NOTE]
> We provided you with an clean express.js server to run the example. For your implementations, feel free to use any library out there to help you with your solution. If you decide to choose another JavaScript/TypeScript http library/framework (eg. NestJs) update the run config described below if needed, and ensure that the routes of the described actions don't change.

## Task 2 - Design an architecture to provide a membership export (conception only)

The team discovered that users are interested in **exporting all of their memberships** from the system to run their own analysis once a month as a **CSV file**. Because the creation of the export file would take some seconds, the team decided to go for an **asynchronous process** for creating the file and sending it via email. The process will be triggered by an API call of the user.

Your task is to **map out a diagram** that visualizes the asynchronous process from receiving the request to sending the export file to the user. This diagram should include all software / infrastructure components that will be needed to make the process as stable and scalable as possible.

Because the team has other things to work on too, this task is timeboxed to **1 hour** and you should share the architecture diagram as a **PDF file**.

> [!NOTE]
> Feel free to use any tool out there to create your diagram. If you are not familiar with such a tool, you can use www.draw.io.

## Repository Intro

In this repository you will find an plain express.js server the exposes API endpoints to consumers. For this exercise, the API endpoints are not protected.

### Installation

```sh
npm install
```

### Usage

```sh
npm run start
```

### Run test

```sh
npm run test
```

## 🗒️ Conditions

- You will have multiple days for the challenge, but most of our candidates spend around **8h to 10h** on this assignment.
- You should put your code in GitHub or GitLab/Bitbucket and send us the link to your repository where we can find the source code. That means no ZIP files.
- Please make sure to include any additional instructions in a readme in case you change something about the compilation or execution of the codebase.

## 💻 Technologies:

We believe that great developers are not bound to a specific technology set, but no matter their toolbox they are able to think critically about how to structure and design good code. For this exercise, we provided just a small and simple set of tools to run the a application and tests. Feel free to use any library out there to help you with your implementation.

### Pre-installed

- Express - https://expressjs.com/
- TypeScript - https://www.typescriptlang.org/
- Jest - https://jestjs.io/

Best of luck and looking forward to what you are able to accomplish! 🙂

 -->

 
# Eversports - Membership API Modernization Task #1

## Duration

Total time spent on both task 1 and 2 is **9.5 hours**, I know that I passed time limit, but I had to clean up a bit before pushing task 1, task 1 alone took 8.7 hours, task 2 didn't take much time tbh as I'm well expereienced in desiging systems with exports

## Summary

Working on this task was a blast 🎉! It felt especially rewarding because I haven’t worked with **TypeScript** in the past 6 months, and it's my absolute favorite language ❤️. This challenge gave me a chance to reconnect with it while applying some of my architectural preferences and testing strategies.

---

## Task 2

Task 2 can be found [here](./docs/task2/) , the documentation in there explains everything behind the design decisions that I made
 
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

The default port is `3000`, you can use the [postman collection](docs/postman/Eversports-task1.postman_collection.json) to test out the APIs.

--- 

## Project structure

```
├───.github
│   └───workflows
├───config
├───docs
│   ├───documentation
│   └───postman
└───src
    ├───config
    ├───data
    ├───legacy
    │   └───routes
    └───modern
        ├───api
        │   ├───routes
        │   └───specs
        ├───application
        │   ├───dto
        │   └───use-cases
        │       └───membership
        │           ├───commands
        │           │   ├───base
        │           │   ├───create-membership
        │           │   └───get-all-memberships
        │           └───queries
        ├───core
        │   ├───decorators
        │   ├───errors
        │   ├───logger
        │   ├───middlewares
        │   ├───scripts
        │   └───types
        ├───domain
        │   └───membership
        │       └───membershipPeriod
        ├───infrastructure
        │   ├───di
        │   ├───interfaces
        │   │   └───repositories
        │   └───persistence
        │       ├───json
        │       └───postgres
        │           ├───entities
        │           └───migrations
        └───tests
            ├───e2e
            ├───fixtures
            │   └───repositories
            ├───helpers
            ├───integration
            └───unit
```

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
- You can find a [generate-keys.sh](generate-keys.sh) file in the repo, this file simply generate keys that I would have used in JWT if I had a user authentication implemented, I decided to leave it there so you know that I inteded to do waaay more in this task ☺️
- I wanted to have also GitHub actions, but due to the time limitations, I decied to have it as minimlistic as possible, but didn't have time to test it though

---

## Documentation

* Detailed architectural decisions and structure explanation can be found in [`docs/documentation`](docs/documentation/architucture-desisions.md).
* [A postman collection](docs/postman/Eversports-task1.postman_collection.json) and [environment](docs/postman/EversportEnv.postman_environment.json) can be found, with response examples.

---

## Final Thoughts

This was a super fun project and I really enjoyed applying my backend and architectural skills. Really looking forward to the next steps 🎉 (hopefully)!
