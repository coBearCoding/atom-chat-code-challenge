import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import TaskController from './src/controllers/task';
import {validApiKey} from "./src/middleware/auth";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(bodyParser.json());


app.use(validApiKey)
// * Routes
app.get('/tasks', TaskController.ListTasks);
app.post('/tasks', TaskController.CreateTask);
app.put('/tasks/:taskId', TaskController.UpdateTask);
app.delete("/tasks/:taskId", TaskController.DeleteTask);



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});