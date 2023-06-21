import {constants} from "http2";
import {Request, Response} from 'express';
import {validate} from 'class-validator';
import {Task, TaskStatusIndex} from '../models/task';
import {TaskService} from '../services/task';
import {sendResponse} from '../helpers/response';

export namespace TaskController{
    export async function listTasks(req: Request, res: Response): Promise<void>{
        let tasks: Task[] = await TaskService.getTasks();
        sendResponse(res, tasks, constants.HTTP_STATUS_OK, "", "");
    }

    export async function createTask(req: Request, res: Response): Promise<void>{

        if(req.body === null || req.body === undefined){
            sendResponse(res, null, constants.HTTP_STATUS_BAD_REQUEST,"", "json cannot be empty");
            return
        }

        let task: Task = new Task(
            req.body.title,
            req.body.dueDate,
            TaskStatusIndex.PENDING,
        );
        task.description = req.body.description;
        task.implementStatus(task.statusIndex);

        let validationErrors = await validate(task);
        if (validationErrors.length > 0){
            console.log(`[Validation Failed] > ${validationErrors}`);
            return
        }

        let saveTask: string = await TaskService.createTask(task.toJson());

        sendResponse(res, null,constants.HTTP_STATUS_CREATED, saveTask, "");
    }

    export async function updateTask(req: Request, res: Response): Promise<void>{
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

        sendResponse(res, null, constants.HTTP_STATUS_OK, saveTask, "");
    }

    export async function deleteTask(req: Request, res: Response): Promise<void>{
        let taskId: string = req.params.taskId;
        let deleteTask: string = await TaskService.deleteTask(taskId);
        sendResponse(res, null, constants.HTTP_STATUS_OK, deleteTask, "");
    }
}