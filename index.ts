import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {validApiKey} from "./src/middleware/auth";
import {TaskController} from "./src/controllers/task";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(bodyParser.json());


app.use(validApiKey)
// * Routes
app.get('/tasks', TaskController.listTasks);
app.post('/tasks', TaskController.createTask);
app.put('/tasks/:taskId', TaskController.updateTask);
app.delete("/tasks/:taskId", TaskController.deleteTask);



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});