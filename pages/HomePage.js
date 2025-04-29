import { AddItemPage } from './AddItemPage.js';
import { ToDoTasksPage } from './ToDoTasksPage.js';
import { CompletedPage } from './CompletedPage.js';

export {HomePage};

class HomePage{
    constructor(page) {
        this.page = page;
        this.url = 'https://abhigyank.github.io/To-Do-List/';
        this.title = 'TO DO LIST';
        this.header = page.locator('h1');
        this.addItemTab = page.locator('a[href="#add-item"]');
        this.toDoTasksTab = page.locator('a[href="#todo"]');
        this.completedTab = page.locator('a[href="#completed"]');
    }

    async navigate() {
        await this.page.goto(this.url);
    }

    async getTitle() {
        return await this.header.innerText();
    }

    async clickAddItemTab() {
        await this.addItemTab.click();
        return new AddItemPage(this.page);
    }

    async clickToDoTasksTab() {
        await this.toDoTasksTab.click();
        return new ToDoTasksPage(this.page);
    }

    async clickCompletedTab() {
        await this.completedTab.click();
        return new CompletedPage(this.page);
    }
}