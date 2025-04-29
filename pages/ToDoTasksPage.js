class ToDoTasksPage {
  constructor(page){
    this.page = page;
    this.incompletedTasks = page.locator('ul#incomplete-tasks > li');
  }

  async getIncompletedTasksCount() {
    return await this.incompletedTasks.count();
  }

  async getIncompletedTaskByText(taskText) {
    return this.incompletedTasks.locator(`text=${taskText}`);
  }

  async markTaskAsCompleted(taskText) {
    const task = await this.getIncompletedTaskByText(taskText);
    const checkbox = task.locator('input[type="checkbox"]');
    await checkbox.check();
  }

  async deleteTask(taskText) {
    const task = await this.getIncompletedTaskByText(taskText);
    const deleteButton = task.locator('button.delete');
    await deleteButton.click();
  }

  async isTaskPresent(taskText) {
    const task = await this.getCompletedTaskByText(taskText);
    return await task.count() > 0;
  }
}