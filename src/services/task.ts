import app from '../../config/firebase/firebase';
import {DocumentData, getFirestore} from 'firebase-admin/firestore';
import {ITaskService, Task, TaskStatusIndex} from "../models/task";

export namespace TaskService {


    const db = getFirestore(app);
    const taskCollection = 'tasks';
    export class TaskServiceImpl implements ITaskService{
        async getTasks(): Promise<Task[]> {
            const tasksCollection: FirebaseFirestore.CollectionReference = db.collection(taskCollection);
            const taskSnapshot: FirebaseFirestore.QuerySnapshot = await tasksCollection.where('statusIndex', '!=', TaskStatusIndex.ERROR).get();

            return taskSnapshot.docs.map(doc => {
                let task: Task = new Task(
                    doc.data().title
                );

                task.id = doc.id;
                task.dueDate = new Date(doc.data().due_date.seconds * 1000)
                task.statusIndex = doc.data().statusIndex;
                task.description = doc.data().description;
                task.status = doc.data().status;

                return task;
            });
        }

        async createTask(data: DocumentData): Promise<string> {
            const taskRef = db.collection(taskCollection);
            try{
                let result = await taskRef.add(data)
                console.log(`Added document with ID: ${result.id}`);
                return "Task created successfully";
            }catch(err){
                console.log(`Error saving to database: ${err}`);
                return "Error creating task";
            }
        }

        async updateTask(id: string, data: DocumentData): Promise<string>{

            const taskRef = db.collection(taskCollection).doc(id);
            try{
                await taskRef.update(data);
                console.log(`Updated document with ID: ${id} - saved data: ${data}`);
                return "Task updated successfully";
            }catch(err){
                console.log(err);
                return "Error updating task";
            }
        }

        async deleteTask(id: string){
            const taskRef = db.collection(taskCollection).doc(id);
            try{
                await taskRef.delete();
                console.log(`Deleted document with id: ${id}`)
                return `Document deleted`;
            }catch(err){
                return "Error deleting task";
            }
        }
    }

}