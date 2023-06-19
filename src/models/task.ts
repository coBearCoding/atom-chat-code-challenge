class Task{
    
    constructor(title: string, dueDate: Date, statusIndex: number){
        this.title = title;
        this.dueDate = dueDate;
        this.statusIndex = statusIndex;
    }

    id?: string;
    title: string = "";
    description?: string; // optional field for more details on task
    dueDate: Date = new Date("00/00/01");
    status?: string = "";
    statusIndex?: number = TaskStatusIndex.PENDING;



    implementStatus(statusIndex: number | undefined){
        
        switch(statusIndex){
            case TaskStatusIndex.PENDING:
                this.status = "PENDING";
                break;
            case TaskStatusIndex.COMPLETED:
                this.status = "COMPLETED";
                break;
            case TaskStatusIndex.DELETED:
                this.status = "DELETED";
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
            case "DELETED":
                this.statusIndex = TaskStatusIndex.DELETED;
                break;
            default:
                this.status = "ERROR";
                this.statusIndex = TaskStatusIndex.ERROR;
        }
    }

    toJson(){
        return{
            title: this.title,
            description:this.description || "",
            due_date: this.dueDate.toString(),
            statusIndex: this.statusIndex,
            status : this.status,
        }
    }
}
    

enum TaskStatusIndex{
    PENDING = 1,
    COMPLETED = 2,
    DELETED = 3,
    ERROR = 4,
}

export{
    Task,
    TaskStatusIndex
}