export {AddItemPage};

class AddItemPage {
    constructor(page) {
        this.page = page;
        this.toDoInputTextBox = page.locator('input#new-task');
        this.addButton = page.locator('div#add-item > button');
    }

    async addItem(item) {
        await this.toDoInputTextBox.fill(item);
        await this.addButton.click();
    }

    async getToDoInputTextBoxValue() {
        return await this.toDoInputTextBox.inputValue();
    }
}