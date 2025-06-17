import {enableValidation, resetValidation} from '../components/validate.js';
import {createCard, addCardToPage} from '../components/card.js';
import {openPopup, closePopup} from '../components/modal.js';
import './../pages/index.css'
import {
    getInitialCards,
    getUserInfo,
    updateUserInfo,
    addCard,
    deleteCard,
    addLike,
    removeLike,
    updateAvatar
} from './api.js';

import logo from '../images/logo.svg'; // URL для лого сайта
const logoImage = document.querySelector('.header__logo');
logoImage.src = logo;

// DOM элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileImage = document.querySelector('.profile__image');
const profileDescription = document.querySelector('.profile__description');

const popupEdit = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const popupEditCloseButton = popupEdit.querySelector('.popup__close');
const popupAddCloseButton = popupAdd.querySelector('.popup__close');
const popupImageCloseButton = popupImage.querySelector('.popup__close');

const editForm = popupEdit.querySelector('.popup__form[name="edit-profile"]');
const addForm = popupAdd.querySelector('.popup__form[name="new-place"]');

const nameInput = editForm.querySelector('.popup__input_type_name');
const descriptionInput = editForm.querySelector('.popup__input_type_description');
const placeNameInput = addForm.querySelector('.popup__input_type_card-name');
const linkInput = addForm.querySelector('.popup__input_type_url');

const placesList = document.querySelector('.places__list');

const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaptionElement = popupImage.querySelector('.popup__caption');

const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

// Функция заполнения формы редактирования профиля текущими данными
function fillEditForm() {
    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;
}

// Функция обработки формы редактирования профиля
function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;
    closePopup(popupEdit);
}

// Функция обработки формы добавления новой карточки
function handleAddFormSubmit(evt) {
    evt.preventDefault();
    const name = placeNameInput.value;
    const link = linkInput.value;
    const newCard = createCard(name, link, handleCardClick);
    addCardToPage(newCard, placesList); // Передаём placesList
    closePopup(popupAdd);
    addForm.reset();
    const submitButton = addForm.querySelector(validationSettings.submitButtonSelector);
    submitButton.classList.add(validationSettings.inactiveButtonClass);
    submitButton.disabled = true;
}

//Функция-обработчик для открытия модального окна с картинкой
function handleCardClick(name, link) {
    popupImageElement.src = link;
    popupImageElement.alt = name;
    popupCaptionElement.textContent = name;
    openPopup(popupImage);
}

// Обработчики событий для изменения профиля и добавления карточек
profileEditButton.addEventListener('click', () => {
    fillEditForm();
    resetValidation(editForm, validationSettings);
    openPopup(popupEdit);
});

profileAddButton.addEventListener('click', () => {
    addForm.reset();
    resetValidation(addForm, validationSettings);
    openPopup(popupAdd);
});

popupEditCloseButton.addEventListener('click', () => closePopup(popupEdit));
popupAddCloseButton.addEventListener('click', () => closePopup(popupAdd));
popupImageCloseButton.addEventListener('click', () => closePopup(popupImage));

editForm.addEventListener('submit', handleEditFormSubmit);
addForm.addEventListener('submit', handleAddFormSubmit);

// Добавление карточки по нажатию кнопки Enter
addForm.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter' && document.activeElement === placeNameInput) {
        evt.preventDefault();
        if (addForm.checkValidity()) {
            handleAddFormSubmit(evt);
        }
    }
});

// Закрытие модального окна кликом на чёрный фон
const popups = document.querySelectorAll('.popup');

popups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target === popup) {
            closePopup(popup);
        }
    });
});

// Инициализация карточек
import {initialCards} from './initial-cards.js';

let curUserId;

// Получение информации о пользователе и начальных карточек с сервера
document.addEventListener('DOMContentLoaded', function () {

    Promise.all([getUserInfo(), getInitialCards()])
        .then(([user,cards]) => {
            profileTitle.textContent = user.name;
            profileDescription.textContent = user.about;
            profileImage.style.backgroundImage = `url(${user.avatar})`;

            curUserId = user._id;

            // Отрисовываем начальные карточки
            cards.forEach(cardData => {
                placesList.append(createCard(cardData, curUserId, handleCardClick));
            });
        })
        .catch(err => {
            console.error('Ошибка при загрузке данных:', err);
        });
});

// Включение валидации для форм
enableValidation(validationSettings);

