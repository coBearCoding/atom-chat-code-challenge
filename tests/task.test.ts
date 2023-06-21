import {describe, expect, test, beforeAll, afterAll} from '@jest/globals';
import {
    initializeTestEnvironment,
    assertSucceeds,
    RulesTestEnvironment
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
            "Task 1",
            new Date("03/07/2023"),
            TaskStatusIndex.PENDING,
        );
        task.description = "Some Description";
        task.implementStatus(task.statusIndex);

        let validationErrors: ValidationError[] = await validate(task);
        expect(validationErrors.length).toBeLessThanOrEqual(0);
    });

    test("Show error when creating a task with missing required parameters", async(): Promise<void> => {
        let task = new Task(
            "",
            new Date("00/00/0000"),
            0
        );

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

    test("Save a task with all parameters given", async (): Promise<void> => {
        // * Add test task data
        let task = new Task(
            "First Task",
            new Date("03/07/2023"),
            TaskStatusIndex.PENDING
        )
        task.description = "Tiny Description";
        task.implementStatus(task.statusIndex);

        let data: DocumentData = task.toJson();
        // * Firebase - Firestore
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = await db.collection("tasks");

        let result = await taskRef.doc("gi2kGLsbuCUiLBihdigP");
        await assertSucceeds(result.set(data));

    });

    test("Update a task with parameters given", async(): Promise<void> => {
        let taskId: string = "gi2kGLsbuCUiLBihdigP"; // * Please remember to change the ID as they are auto-generated

        let task: Task = new Task(
            "Second Task",
            new Date("03/08/2023"),
            TaskStatusIndex.COMPLETED,
        );
        task.description = "Long description";
        task.status = "COMPLETED";
        task.reverseImplementStatus(task.status);

        let data: DocumentData = task.toJson();
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = await db.collection("tasks").doc(taskId);
        await assertSucceeds(taskRef.update(data));
    });

    test("Delete a task with the id parameter", async(): Promise<void> => {
       let taskId = "gi2kGLsbuCUiLBihdigP";
        const db = testEnvironment.unauthenticatedContext().firestore();
        const taskRef = db.collection("tasks").doc(taskId);
        await assertSucceeds(taskRef.delete());
    });


    afterAll(async() => {
       await testEnvironment.clearFirestore();
    });
});
