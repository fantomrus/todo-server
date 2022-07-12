module.exports = class UserDto {
    id;
    firstName;
    lastName;
    patronymic;
    login;
    role;
    constructor(model) {
        this.id = model._id
        this.firstName = model.firstName
        this.lastName = model.lastName
        this.patronymic = model.patronymic
        this.login = model.login
        this.role = model.role
    }
}