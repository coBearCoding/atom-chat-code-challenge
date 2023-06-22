import {DocumentData} from "firebase-admin/lib/firestore";

export interface FirebaseOperations {
    createTask: (data: DocumentData) => Promise<string>;
    updateTask: (id: string, data: DocumentData) => Promise<string>;
    deleteTask: (id: string) => Promise<string>;
}