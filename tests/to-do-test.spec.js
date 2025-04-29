import {test, expect} from '@playwright/test';
import {HomePage} from '../pages/HomePage.js';

let homePage;

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
    expect(await homePage.getTitle()).toBe(homePage.title);
});

test.describe('Add Item', () => {
    test('should allow me to add new item', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText = 'New Task';
        await addItemPage.addItem(taskText);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        expect(await toDoTasksPage.getIncompletedTasksCount()).toBe(1);
        expect(await toDoTasksPage.getIncompletedTaskByText(taskText)).toBeTruthy();
    });

    test('should not allow me to add empty item', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        await addItemPage.addItem('');

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        expect(await toDoTasksPage.getIncompletedTasksCount()).toBe(0);
    });

    test('should not allow me to add duplicate item', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText = 'Duplicate Task';
        await addItemPage.addItem(taskText);
        await addItemPage.addItem(taskText);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        expect(await toDoTasksPage.getIncompletedTasksCount()).toBe(1);
        expect(await toDoTasksPage.getIncompletedTaskByText(taskText)).toBeTruthy();
    });

    test('should clear input field after adding item', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText = 'Task to be cleared';
        await addItemPage.addItem(taskText);

        expect(await addItemPage.getToDoInputTextBoxValue()).toBe('');
    });

    test('should allow me to add multiple items', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText1 = 'First Task';
        const taskText2 = 'Second Task';
        await addItemPage.addItem(taskText1);
        await addItemPage.addItem(taskText2);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        expect(await toDoTasksPage.getIncompletedTasksCount()).toBe(2);
        expect(await toDoTasksPage.getIncompletedTaskByText(taskText1)).toBeTruthy();
        expect(await toDoTasksPage.getIncompletedTaskByText(taskText2)).toBeTruthy();
    });

    test('should not allow me to add item with only spaces', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        await addItemPage.addItem('    ');

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        expect(await toDoTasksPage.getIncompletedTasksCount()).toBe(0);
    });
});

test.describe('To Do Tasks', () => {
    test('should allow me to mark task as completed', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText = 'Task to be completed';
        await addItemPage.addItem(taskText);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        await toDoTasksPage.markTaskAsCompleted(taskText);

        const completedPage = await homePage.clickCompletedTab();
        expect(await completedPage.getCompletedTasksCount()).toBe(1);
        expect(await completedPage.getCompletedTaskByText(taskText)).toBeTruthy();
    });

    test('should allow me to delete task', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText = 'Task to be deleted';
        await addItemPage.addItem(taskText);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        await toDoTasksPage.deleteTask(taskText);

        expect(await toDoTasksPage.getIncompletedTasksCount()).toBe(0);
    });

    test('should not change the tasks order when one is deleted', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText1 = 'Task 1';
        const taskText2 = 'Task 2';
        const taskText3 = 'Task 3';
        await addItemPage.addItem(taskText1);
        await addItemPage.addItem(taskText2);
        await addItemPage.addItem(taskText3);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        await toDoTasksPage.deleteTask(taskText2);

        expect(await toDoTasksPage.getIncompletedTasksCount()).toBe(2);
        expect(await toDoTasksPage.getIncompletedTaskByText(taskText1)).toBeTruthy();
        expect(await toDoTasksPage.getIncompletedTaskByText(taskText3)).toBeTruthy();
    });
});

test.describe('Completed Tasks', () => {
    test('should allow me to delete completed task', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText = 'Completed Task to be deleted';
        await addItemPage.addItem(taskText);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        await toDoTasksPage.markTaskAsCompleted(taskText);

        const completedPage = await homePage.clickCompletedTab();
        await completedPage.deleteTask(taskText);

        expect(await completedPage.getCompletedTasksCount()).toBe(0);
    });

    test('should not show deleted task in completed tasks', async ({ page }) => {
        const addItemPage = await homePage.clickAddItemTab();
        const taskText = 'Task to be deleted from completed';
        await addItemPage.addItem(taskText);

        const toDoTasksPage = await homePage.clickToDoTasksTab();
        await toDoTasksPage.markTaskAsCompleted(taskText);

        const completedPage = await homePage.clickCompletedTab();
        await completedPage.deleteTask(taskText);

        expect(await completedPage.isTaskPresent(taskText)).toBe(false);
    });
});