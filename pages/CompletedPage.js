class CompletedPage {
  constructor(page) {
    this.page = page;
    this.completedTasks = page.locator('ul#completed-tasks > li');
  }

  async getCompletedTasksCount() {
    return await this.completedTasks.count();
  }

  async getCompletedTaskByText(taskText) {
    return this.completedTasks.locator(`text=${taskText}`);
  }

  async deleteTask(taskText) {
    const task = await this.getCompletedTaskByText(taskText);
    const deleteButton = task.locator('button.delete');
    await deleteButton.click();
  }

  async isTaskPresent(taskText) {
    const task = await this.getCompletedTaskByText(taskText);
    return await task.count() > 0;
  }
}