import app from '../../config/firebase/firebase';
import {DocumentData, getFirestore} from 'firebase-admin/firestore';
import {Task, TaskStatusIndex} from "../models/task";

export namespace TaskService {
    const db = getFirestore(app);
    const taskCollection = 'tasks';

    export async function getTasks() : Promise<Task[]>{
        const tasksCollection: FirebaseFirestore.CollectionReference = db.collection(taskCollection);
        const taskSnapshot: FirebaseFirestore.QuerySnapshot = await tasksCollection.where('statusIndex', '!=', TaskStatusIndex.ERROR).get();

        return taskSnapshot.docs.map(doc => {
            let task: Task = new Task(
                doc.data().title,
                doc.data().due_date,
                doc.data().statusIndex
            )
            task.id = doc.id;
            task.description = doc.data().description;
            task.status = doc.data().status;

            return task;
        });
    }

    export async function createTask(data: DocumentData): Promise<string> {
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

    export async function updateTask(id: string, data: DocumentData): Promise<string>{

        const taskRef = db.collection(taskCollection).doc(id);
        try{
            await taskRef.update(data);
            console.log(`Updated document with ID: ${id} - saved data: ${data}`);
            return "Task updated successfully";
        }catch(err){
            return "Error updating task";
        }
    }

    export async function deleteTask(id: string): Promise<string>{
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