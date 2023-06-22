import {describe, expect, test, beforeAll, afterAll} from '@jest/globals';
import {
    initializeTestEnvironment,
    RulesTestEnvironment,
    assertSucceeds, assertFails,
} from '@firebase/rules-unit-testing';
import dotenv from "dotenv";
import {validate, ValidationError} from 'class-validator';
import {Task, TaskStatusIndex} from '../src/models/task';
import {DocumentData} from "firebase-admin/firestore";

dotenv.config();

let testEnvironment: RulesTestEnvironment;

describe("Task Class Validation - Task Module Tests", function (): void {
    test("Create a task instance with all required parameters", async(): Promise<void> => {
        let task = new Task(
            "Task 1"
        );
        task.dueDate = new Date("2023/05/07")
        task.statusIndex = TaskStatusIndex.PENDING;
        task.description = "Some Description";
        task.implementStatus(task.statusIndex);

        let validationErrors: ValidationError[] = await validate(task);
        expect(validationErrors.length).toBeLessThanOrEqual(0);
    });

    test("Show error when creating a task with missing required parameters", async(): Promise<void> => {
        let task = new Task(
            ""
        );

        let validationErrors = await validate(task);
        expect(validationErrors.length).toBeGreaterThan(0);
    });

    test("Show error when a task instance with wrong date format", async(): Promise<void> => {
        let task = new Task(
            "Task 1"
        );
        task.dueDate = new Date("06/02/2023/01");
        task.statusIndex = TaskStatusIndex.PENDING;
        task.description = "Some Description";
        task.implementStatus(task.statusIndex);

        let validationErrors = await validate(task);
        expect(validationErrors.length).toBeGreaterThan(0);
    });

    test("Show error if status is different from PENDING or COMPLETED", async(): Promise<void> => {
        let task = new Task(
            "Task 1"
        );
        task.dueDate = new Date("06/02/2023");
        task.status = "DEFAULT";
        task.description = "Some Description";
        task.reverseImplementStatus(task.status);

        let validationErrors = await validate(task);
        expect(validationErrors.length).toBeGreaterThan(0);
    });
});

describe('Firebase Firestore - Task Module  Tests',function (): void {
    beforeAll(async () => {
        testEnvironment = await initializeTestEnvironment({
            projectId: process.env.FIREBASE_PROJECT_ID,
            firestore: {
                host: "127.0.0.1",
                port: 8080,
            }
        });
    })

    test("Can read tasks from the collection", async (): Promise<void> => {
        const db = testEnvironment.unauthenticatedContext().firestore();
        const tasksCollection = await db.collection("tasks");
        const taskSnapshot =  await tasksCollection.where('statusIndex', '!=', TaskStatusIndex.ERROR)
        await assertSucceeds(taskSnapshot.get());
    });

    test("Create a task with all parameters given", async (): Promise<void> => {
        // * Add test task data
        let task = new Task(
            "First Task",
        )
        task.dueDate = new Date("2023/05/07");
        task.statusIndex = TaskStatusIndex.PENDING;
        task.description = "Tiny Description";
        task.implementStatus(task.statusIndex);

        let data: DocumentData = task.toJson();
        // * Firebase - Firestore
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = await db.collection("tasks");

        let result = await taskRef.doc("gi2kGLsbuCUiLBihdigP");
        await assertSucceeds(result.set(data));

    });

    test("Show error when creating a task with an already added Title", async(): Promise<void> => {
        // * Add test task data
        let task = new Task(
            "First Task",
        )
        task.dueDate = new Date("2023/05/07");
        task.statusIndex = TaskStatusIndex.PENDING;
        task.description = "Tiny Description";
        task.implementStatus(task.statusIndex);

        let data: DocumentData = task.toJson();
        // * Firebase - Firestore
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = await db.collection("tasks");

        try{
            let doc = await taskRef.where("title", "==", task.title).get();
            if(!doc.empty){
                throw new Error('Error creating task');
            }
            let result = await taskRef.doc("gi2kGLsbuCUiLBihdigP");
            await result.set(data);
        }catch (e){
            expect(typeof(e)).toMatch("object");
        }

    });

    test("Update a task with parameters given", async(): Promise<void> => {
        let taskId: string = "gi2kGLsbuCUiLBihdigP"; // * Please remember to change the ID as they are auto-generated

        let task: Task = new Task(
            "Second Task",
        );
        task.dueDate = new Date("2023/05/07");
        task.description = "Long description";
        task.status = "COMPLETED";
        task.reverseImplementStatus(task.status);

        let data: DocumentData = task.toJson();
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = await db.collection("tasks").doc(taskId);
        await assertSucceeds(taskRef.update(data));
    });

    test("Show error when updating a task the wrong id parameter", async(): Promise<void> => {
        let taskId: string = "1nonExistent2"; // * Please remember to change the ID as they are auto-generated

        let task: Task = new Task(
            "Third Task"
        );
        task.dueDate = new Date("2023/05/07");
        task.description = "Medium description";
        task.status = "COMPLETED";
        task.reverseImplementStatus(task.status);

        let data: DocumentData = task.toJson();
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = await db.collection("tasks").doc(taskId);
        try{
            await taskRef.update(data);
        }catch (e){
            expect(typeof(e)).toMatch("object");
        }
    });

    test("Delete a task with the id parameter", async(): Promise<void> => {
       let taskId = "gi2kGLsbuCUiLBihdigP";
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = db.collection("tasks").doc(taskId);
        await assertSucceeds(taskRef.delete());
    });

    test("Show error when deleting a task the wrong id parameter", async(): Promise<void> => {
        let taskId = "1nonExistent2";

        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = db.collection("tasks").doc(taskId);
        await expect(taskRef.delete()).resolves.toBe(undefined);
    });


    afterAll(async() => {
       await testEnvironment.clearFirestore();
    });
});
