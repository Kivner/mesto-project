import { deleteCard, addLike, removeLike } from './api';

export function createCard(cardData, userId, handleCardClick) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const likeCountElement = cardElement.querySelector('.card__like-count');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    likeCountElement.textContent = cardData.likes.length;

    const isLiked = cardData.likes.some(like => like._id === userId);
    if (isLiked) {
        cardLikeButton.classList.add('card__like-button_is-active');
    }

    cardLikeButton.addEventListener('click', () => {
        const likePromise = cardLikeButton.classList.contains('card__like-button_is-active')
            ? removeLike(cardData._id)
            : addLike(cardData._id);

        likePromise
            .then(updatedCard => {
                cardLikeButton.classList.toggle('card__like-button_is-active');
                likeCountElement.textContent = updatedCard.likes.length;
            })
            .catch(err => {
                console.error('Ошибка при лайке/дизлайке карточки:', err);
            });
    });
    
    if (cardData.owner._id === userId) {
        cardDeleteButton.addEventListener('click', () => {
            deleteCard(cardData._id)
                .then(() => {
                    cardElement.remove();
                })
                .catch(err => {
                    console.error('Ошибка при удалении карточки:', err);
                });
        });
    } else {
        cardDeleteButton.remove();
    }

    cardImage.addEventListener('click', () => {
        handleCardClick(cardData.name, cardData.link);
    });
    return cardElement;
}

export function addCardToPage(card, container) {
    container.prepend(card);
}
