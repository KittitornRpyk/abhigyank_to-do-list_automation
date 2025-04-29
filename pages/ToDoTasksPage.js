export { ToDoTasksPage };

const incompletedTasksLocator = 'ul#incomplete-tasks > li';
const incompletedTaskTextLocator = 'span.mdl-checkbox__label';
const incompletedTaskDeleteButtonLocator = 'button.delete';

let tasks = [];

class ToDoTasksPage {
    constructor(page) {
        this.page = page;
        this.incompletedTasks = page.locator(incompletedTasksLocator);
    }

    async getIncompletedTasksCount() {
        const isVisible = await this.incompletedTasks.first().isVisible().catch(() => false);
        return isVisible ? await this.incompletedTasks.count() : 0;
    }

    async getAllIncompletedTasks() {
        const tasksCount = await this.incompletedTasks.count();
        for (let i = 0; i < tasksCount; i++) {
            const taskText = await this.incompletedTasks.nth(i).locator(incompletedTaskTextLocator).innerText();
            const taskCheckbox = await this.incompletedTasks.nth(i).locator(incompletedTaskTextLocator);
            const taskDeleteButton = await this.incompletedTasks.nth(i).locator(incompletedTaskDeleteButtonLocator);
            tasks.push({ name: taskText, checkbox: taskCheckbox, deleteButton: taskDeleteButton });
        }
        return tasks;
    }

    async getIncompletedTaskByText(taskText) {
        await this.getAllIncompletedTasks();
        return tasks.find(t => t.name === taskText);
    }

    async markTaskAsCompleted(taskText) {
        const task = await this.getIncompletedTaskByText(taskText);
        const checkbox = task.checkbox;
        await checkbox.click();
    }

    async deleteTask(taskText) {
        const task = await this.getIncompletedTaskByText(taskText);
        const deleteButton = task.deleteButton;
        await deleteButton.click();
    }

    async isTaskPresent(taskText) {
        const isVisible = await this.incompletedTasks.first().isVisible().catch(() => false);
        if (!isVisible) {
            return false;
        }
        const task = await this.getIncompletedTaskByText(taskText).catch(() => null);
        return task !== null;
    }
}