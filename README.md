# Habit Pet

## Running
To run the frontend:
```bash
npm start
```

To run the backend:
```bash
node ./server/index.js
```

Run both at the same time for full feature set

### Required Enviroment
| Enviroment Variable | Default Value | Description |
|:--:|:--:|:--:|
| MONGO_URI | N/A | MongoDB connection string |
| API_URI | http://localhost:5000 | The URI of the api. The port should be the same as PORT |
| JWT_SECRET | Random 64 byte string (see ./scripts/checkenv.js) | Private signature for JWT authentication |
| SERVER_PORT | 5000 | The port on which the backend runs on |
| PORT (Optional) | 3000 | The port on which the frontend runs on |