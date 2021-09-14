class EditNavigation {
    constructor(config) {
        this.elName = config.element;
        this.field = config.field;
        this.dataInput = config.data;
    }

    logConfig() {
        console.log(this.elName, this.field, this.dataInput);
    }
}