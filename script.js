document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');
    const modalWindow = document.querySelector('.modal');
    const closeModalButton = document.querySelector('.modal-wrapper .close');
    const addToBasketButton = document.querySelectorAll('.basket-button');
    const basketIcon = document.querySelector('.basket-icon');
    const menuBurgerButton = document.querySelector('.menu-mobile');
    const navMenu = document.querySelector('.menu-wrapper');
    const navLinks = document.querySelectorAll('.nav-buttons-panel ul li');
    const closeIcon = document.querySelector('.fa-times');
    const openIcon = document.querySelector('.fa-bars');
    const basketItemsWrapper = document.querySelector('.list-of-goods');

    /*Mobile menu instructions*/
    menuBurgerButton.addEventListener('click', () => {
        closeIcon.classList.toggle('hide');
        openIcon.classList.toggle('hide');

        if (openIcon.classList.contains('hide')) {
            navMenu.classList.add('open');
            body.classList.add('hidden');
        } else {
            navMenu.classList.remove('open');
            body.classList.remove('hidden');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('hidden');
            navMenu.classList.remove('open');
            openIcon.classList.remove('hide');
            closeIcon.classList.add('hide');
        });
    });

    /*Basket modal window instructions*/
    modalWindow.addEventListener("click", (event) => {
        if (event.target === modalWindow) {
            modalWindow.close();
            body.classList.remove('hidden');
        }
    });

    basketIcon.addEventListener('click', () => {
        modalWindow.showModal();
        body.classList.add('hidden');
    });

    closeModalButton.addEventListener('click', () => {
        modalWindow.close();
        body.classList.remove('hidden');
    });

    /*Basket instructions*/
    addToBasketButton.forEach(button => {
        button.addEventListener('click', () => {
            let parent = button.closest('.card-wrapper');
            let basketCards = basketItemsWrapper.querySelectorAll('.card-wrapper');
            let currentId = Number(parent.getAttribute('product-id'));

            let htmlPosition = `
                <div class="card-wrapper" product-id="${parent.getAttribute('product-id')}" product-cost="${parent.getAttribute('product-cost')}">
                    <img src="${parent.querySelector('img').src}" />
                    <div class="card-info">
                        <p class="card-title">${parent.querySelector('.card-title').textContent}</p>
                        <p class="card-price"><span class="amount">${parent.querySelector('.card-price .amount').textContent}</span> руб.</p>
                    </div>
                    <div class="card-quantity">
                        <button class="card-quantity-down"></button>
                        <span class="count">1</span>
                        <button class="card-quantity-up"></button>
                        <button class="card-remove">Удалить</button>
                    </div>
                </div>
            `;

            let totalPrice = 0;

            /*Checking if basket already have clicked id of goods*/
            if (basketCards.length === 0) {
                basketItemsWrapper.insertAdjacentHTML('afterbegin', htmlPosition);

                totalPrice = calculatePrice();
                let priceTag = `
                    <div class="total-price">Сумма: <span>${totalPrice}</span> руб.</div>
                `;
                basketItemsWrapper.insertAdjacentHTML('beforeend', priceTag);
            } else {
                let productState = true;

                basketCards.forEach(el => {
                    if (Number(el.getAttribute('product-id')) === currentId) {
                        productState = false;
                    };
                });

                if (productState === true) {
                    basketItemsWrapper.insertAdjacentHTML('afterbegin', htmlPosition);
                };
                
                totalPrice = calculatePrice();

                /*If price tag already exists, just update total price in span here*/
                if (basketItemsWrapper.querySelector('.total-price') != null) {
                    basketItemsWrapper.querySelector('.total-price span').textContent = totalPrice;
                };
            };

            /*Clicked button animation*/
            button.classList.add('added');
            setTimeout(function() {
                button.classList.remove('added');
            }, 2000);

            checkState();
            basketIconCounter();
        });
    });

    /*Checking basket state, if it's empty or not*/
    function checkState() {
        let modalTitle = document.querySelector('.modal-wrapper .modal-title');
        let modalForm = document.querySelector('.modal-wrapper form');

        /*Empty basket message*/
        if (basketItemsWrapper.innerHTML !== '') {
            backetHandler();
            modalTitle.style.display = null;
            modalForm.style.display = null;
            basketIcon.style.display = 'unset';
            
            if (basketItemsWrapper.querySelector('.empty-basket')) {
                basketItemsWrapper.querySelector('.empty-basket').remove();
            };

        } else {
            let noItemsText = `
            <div class="empty-basket">
                <i class="fa fa-shopping-basket" aria-hidden="true"></i>
                <p style="font-weight: 700;">Ваша корзина пуста</p>
                <p>Для оформления заказа добавьте нужные товары.</p>
            </div>
            `;
            basketItemsWrapper.insertAdjacentHTML('afterbegin', noItemsText);
            modalTitle.style.display = 'none';
            modalForm.style.display = 'none';
            basketIcon.style.display = null;
        };
    };

    /*Basket controls: adding, removing goods*/
    function backetHandler() {
        let quantityMinus = document.querySelectorAll('.card-quantity-down');
        let quantityPlus = document.querySelectorAll('.card-quantity-up');
        let removeButton = document.querySelectorAll('.card-remove');
        let totalPrice = 0;

        quantityMinus.forEach(button => {
            button.onclick = function(event) {
                event.preventDefault();

                let parent = button.closest('.card-quantity');
                let count = parent.querySelector('.count');

                count.textContent = Number(count.textContent) - 1;

                if (Number(count.textContent) < 1) {
                    parent.closest('.card-wrapper').remove();
                    
                    if (basketItemsWrapper.querySelectorAll('.card-wrapper').length === 0) {
                        basketItemsWrapper.querySelector('.total-price').remove();
                        basketItemsWrapper.innerHTML = '';
                        checkState();
                    };
                };

                totalPrice = calculatePrice();
                
                updatePrice();
                basketIconCounter();
            };
        });

        quantityPlus.forEach(button => {
            button.onclick = function(event) {
                event.preventDefault();

                let parent = button.closest('.card-quantity');
                let count = parent.querySelector('.count');

                count.textContent = Number(count.textContent) + 1;

                totalPrice = calculatePrice();
                
                if (basketItemsWrapper.querySelectorAll('.card-wrapper').length !== 0) {
                    basketItemsWrapper.querySelector('.total-price span').textContent = totalPrice;
                };

                updatePrice();
                basketIconCounter();
            };
        });

        removeButton.forEach(button => {
            button.onclick = function(event) {
                event.preventDefault();
                
                let parent = button.closest('.card-quantity');
                parent.closest('.card-wrapper').remove();

                updatePrice();
                basketIconCounter();
            };
        });
    };

    /*Basket icon counter*/
    function basketIconCounter() {
        let basketCards = basketItemsWrapper.querySelectorAll('.card-wrapper');
        let basketCounter = document.querySelector('.basket-counter');

        let quantity = 0;

        basketCards.forEach(el => {
            let count = el.querySelector('.card-quantity .count').textContent;
            quantity += Number(count);
        });

        basketCounter.textContent = quantity;
    };
    
    /*Calculating final price*/
    function calculatePrice() {
        let card = basketItemsWrapper.querySelectorAll('.card-wrapper');
        
        let totalPrice = 0;

        card.forEach(el => {
            let count = el.querySelector('.card-quantity .count').textContent;
            let amount = el.getAttribute('product-cost');
            let basketAmount = el.querySelector('.card-price .amount');
            
            basketAmount.textContent = Number(count) * Number(amount);
            totalPrice += Number(basketAmount.textContent);
        });
        
        return totalPrice;
    };

    /*Updating price for product*/
    function updatePrice() {
        let totalPrice = calculatePrice();

        if (basketItemsWrapper.querySelectorAll('.card-wrapper').length !== 0) {
            basketItemsWrapper.querySelector('.total-price span').textContent = totalPrice;
        } else {
            basketItemsWrapper.querySelector('.total-price').remove();
            basketItemsWrapper.innerHTML = '';
            
            checkState();
        };
    };
})