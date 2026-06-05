# Habit Pet

## Running Locally
> [!NOTE]
> To run the project, there is a required [environment](#required-environment)

To run the full stack:
```bash
npm run dev:all
```

To run the E2E tests:
```bash
npm test # alias for npx playwright test

# Optionally
npx playwright test --ui # Shows ui that allows for testing individual tests
```

To run just the frontend:
```bash
npm frontend
```

To run just the backend:
```bash
node backend
```

### Required Environment
| Environment Variable | Default Value | Description |
|:--:|:--:|:--:|
| MONGO_URI | N/A | MongoDB connection string |
| API_URI | http://localhost:5000 | The URI of the api. The port should be the same as PORT |
| JWT_SECRET | Random 64 byte string (see ./scripts/checkenv.js) | Private signature for JWT authentication |
| SERVER_PORT | 2000 (REQUIRED FOR LOCAL) | The port on which the backend runs on |
| PORT (Optional) | 3000 | The port on which the frontend runs on |

<details>
    <summary>ENV VAR Usage and Generation</summary>

    - MONGO_URI is created from the mongodb atlas website. No specific configuration is required for the databse.

    - API_URI is an outdated variable. It is still required in case of future changes or reverts

    - JWT_SECRET is used by the jwt package for the token signature. Running `node ./scripts/checkenv.js` when JWT_SECRET is not set will output the command that will generate the secret

    - SERVER_PORT is used by the backend to run on the port. Currently, it is hardcoded to be 2000 as it is unused by both Windows and Mac devices, unlike port 5000.

    - PORT is the port in which the frontend runds in.
</details>

## Design

Class Diagram showing database models:
![Class Diagram showing database models](/Assets/Class_diagram.png)

Sequnce Diagram showiing habit completion flow:
![Sequence Diagram showing habit completion flow](/Assets/sequence_diagram.png)

## Testing
Tests are in the `./tests` folder.
The E2E tests are using playwright. The tests require the fullstack to be running, meaning
the forementioned [environment](#required-environment)

## Contributors

Note: Some team members have two names for commits. The following usernames belong to the same contributors:
- "Millie" and "Lemons422" are both Millie Chen
- "oonamo" and "Onam Hernandez" are both Onam Hernandez