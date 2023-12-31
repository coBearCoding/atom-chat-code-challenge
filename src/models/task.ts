import {IsDate, Min, IsNotEmpty, IsNumber, IsString, Validate} from 'class-validator';
import {CustomStatusValidator} from '../validators/customValidator';
import {FirebaseOperations} from "./firebaseOperations";
import {DocumentData} from "firebase-admin/lib/firestore";

export enum TaskStatusIndex{
    PENDING = 1,
    COMPLETED = 2,
    ERROR = 3,
}

export class Task{
    id?: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    description?: string; // optional field for more details on task

    @IsDate({
        message: "dueDate must be a valid date"
    })
    @IsNotEmpty({
        message: "dueDate can't be empty"
    })
    dueDate?: Date;

    @IsNotEmpty({
        message: "status can't be empty, it should be PENDING or COMPLETED"
    })
    @IsString({
        message: "status must be type string, it should be PENDING or COMPLETED"
    })
    @Validate(CustomStatusValidator, {
        message: "status should be PENDING OR COMPLETED"
    })
    status?: string;

    @IsNumber()
    @Min(1)
    statusIndex?: number = TaskStatusIndex.PENDING;


    constructor(title: string){
        this.title = title;
    }


    implementStatus(statusIndex: number | undefined){
        
        switch(statusIndex){
            case TaskStatusIndex.PENDING:
                this.status = "PENDING";
                break;
            case TaskStatusIndex.COMPLETED:
                this.status = "COMPLETED";
                break;

            default:
                this.status = "ERROR";
                this.statusIndex = TaskStatusIndex.ERROR;
        }      
    }

    reverseImplementStatus(status: string | undefined){
        switch(status){
            case "PENDING":
                this.statusIndex = TaskStatusIndex.PENDING;
                break;
            case "COMPLETED":
                this.statusIndex = TaskStatusIndex.COMPLETED;
                break;
            default:
                this.statusIndex = TaskStatusIndex.ERROR;
        }
    }

    toJson(){
        return{
            title: this.title,
            description: this.description || "",
            due_date: this.dueDate,
            statusIndex: this.statusIndex,
            status : this.status,
        }
    }
}

export interface ITaskService extends FirebaseOperations{
    getTasks: () => Promise<Task[]>;
    createTask: (data: Task) => Promise<string>;
}