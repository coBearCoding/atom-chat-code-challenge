import {constants} from "http2";
import {Request, Response} from 'express';
import {Task, TaskStatusIndex} from '../models/task';
import TaskService from '../services/task';
import Helpers from '../helpers/response';

async function ListTasks(req: Request, res: Response): Promise<void>{
    let tasks: Task[] = await TaskService.getTasks();
    Helpers.sendResponse(res, tasks, constants.HTTP_STATUS_OK, "", "");
}

async function CreateTask(req: Request, res: Response): Promise<void>{

    if(req.body === null || req.body === undefined){
        Helpers.sendResponse(res, null, constants.HTTP_STATUS_BAD_REQUEST,"", "json cannot be empty");
        return
    }

    let task: Task = new Task(
        req.body.title,
        req.body.dueDate,
        TaskStatusIndex.PENDING,
    );
    task.description = req.body.description;
    task.implementStatus(task.statusIndex);

    let saveTask: string = await TaskService.createTask(task.toJson());

    Helpers.sendResponse(res, null,constants.HTTP_STATUS_CREATED, saveTask, "");
}

async function UpdateTask(req: Request, res: Response): Promise<void>{
    let taskId: string = req.params.taskId;

    let task: Task = new Task(
        req.body.title,
        req.body.dueDate,
        TaskStatusIndex.PENDING,
    );
    task.description = req.body.description;
    task.status = req.body.status;
    task.reverseImplementStatus(req.body.status);

    let saveTask: string = await TaskService.updateTask(taskId,task.toJson());

    Helpers.sendResponse(res, null, constants.HTTP_STATUS_OK, saveTask, "");
}

async function DeleteTask(req: Request, res: Response): Promise<void>{
    let taskId: string = req.params.taskId;
    let deleteTask: string = await TaskService.deleteTask(taskId);
    Helpers.sendResponse(res, null, constants.HTTP_STATUS_OK, deleteTask, "");
}

export default {
    ListTasks,
    CreateTask,
    UpdateTask,
    DeleteTask
}