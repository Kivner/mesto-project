// Показать ошибки ввода поля
export const showInputError = (formElement, inputElement, errorMessage, settings) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (errorElement) {
        inputElement.classList.add(settings.inputErrorClass);
        errorElement.textContent = errorMessage;
        errorElement.classList.add(settings.errorClass);
    }
};

// Скрыть ошибки ввода поля
export const hideInputError = (formElement, inputElement, settings) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (errorElement) {
        inputElement.classList.remove(settings.inputErrorClass);
        errorElement.textContent = '';
        errorElement.classList.remove(settings.errorClass);
    }
};

// Проверка валидации
export const checkInputValidity = (formElement, inputElement, settings) => {
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, settings);
    } else {
        hideInputError(formElement, inputElement, settings);
    }
};

// Добавление события для кнопки
export const setEventListeners = (formElement, settings) => {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, settings);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(formElement, inputElement, settings);
            toggleButtonState(inputList, buttonElement, settings);
        });
    });
};

// Есть ли ошибка поля ввода
export const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

// Переключение состояния кнопок
export const toggleButtonState = (inputList, buttonElement, settings) => {
    if (buttonElement) {
        if (hasInvalidInput(inputList)) {
            buttonElement.classList.add(settings.inactiveButtonClass);
            buttonElement.disabled = true;
        } else {
            buttonElement.classList.remove(settings.inactiveButtonClass);
            buttonElement.disabled = false;
        }
    }
};

// Добавление события для валидации
export const enableValidation = (settings) => {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));
    formList.forEach((formElement) => {
        formElement.addEventListener('submit', function (evt) {
            evt.preventDefault();
        });
        setEventListeners(formElement, settings);
    });
};

// Сброс валидации (при закрытии попапа)
export const resetValidation = (formElement, settings) => {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, settings);
    });

    toggleButtonState(inputList, buttonElement, settings);
};
