export { CompletedPage };

const completedTasksLocator = 'ul#completed-tasks > li';
const completedTaskTextLocator = 'span.mdl-list__item-primary-content';
const completedTaskDeleteButtonLocator = 'button.delete';

let tasks = [];

class CompletedPage {
    constructor(page) {
        this.page = page;
        this.completedTasks = page.locator(completedTasksLocator);
    }

    async getCompletedTasksCount() {
        const isVisible = await this.completedTasks.first().isVisible().catch(() => false);
        return isVisible ? await this.completedTasks.count() : 0;
    }

    async getAllCompletedTasks() {
        const tasksCount = await this.completedTasks.count();
        for (let i = 0; i < tasksCount; i++) {
            const taskText = await this.completedTasks.nth(i).locator(completedTaskTextLocator).innerText();
            const taskDeleteButton = await this.completedTasks.nth(i).locator(completedTaskDeleteButtonLocator);
            tasks.push({ name: taskText.replace("done", "").replace("\"", "").trim(), deleteButton: taskDeleteButton });
        }
        return tasks;
    }

    async getCompletedTaskByText(taskText) {
        await this.getAllCompletedTasks();
        const task = tasks.find(t => t.name === taskText);
        if (!task) {
            throw new Error(`Task with text "${taskText}" not found`);
        }
        return task;
    }

    async deleteTask(taskText) {
        const task = await this.getCompletedTaskByText(taskText);
        const deleteButton = task.deleteButton;
        await deleteButton.click();
    }

    async isTaskPresent(taskText) {
        const isVisible = await this.completedTasks.first().isVisible().catch(() => false);
        if (!isVisible) {
            return false;
        }
        const task = await this.getCompletedTaskByText(taskText).catch(() => null);
        return task !== null;
    }
}