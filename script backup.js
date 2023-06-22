document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');
    const modalWindow = document.querySelector('.modal');
    const closeModalButton = document.querySelector('.modal-wrapper .close');
    const menuBurger = document.querySelector('.menu-mobile');
    const navMenu = document.querySelector('.menu-wrapper');
    const closeIcon = document.querySelector('.fa-times');
    const openIcon = document.querySelector('.fa-bars');
    const basketButton = document.querySelectorAll('.basket-button');
    const basketIcon = document.querySelector('.basket-icon');
    const navLinks = document.querySelectorAll('.nav-buttons-panel ul li');

    /*Mobile menu instructions*/
    menuBurger.addEventListener('click', () => {
        closeIcon.classList.toggle('hide');
        openIcon.classList.toggle('hide');

        if (openIcon.classList.contains('hide')) {
            navMenu.classList.add('open');
            body.classList.add('hidden');
        } else {
            navMenu.classList.remove('open');
            body.classList.remove('hidden');
        }
    })

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('hidden');
            navMenu.classList.remove('open');
            openIcon.classList.remove('hide');
            closeIcon.classList.add('hide');
        });
    });

    /*Modal window instructions*/
    modalWindow.addEventListener("click", (event) => {
        if (event.target === modalWindow) {
            modalWindow.close();
            body.classList.remove('hidden');
        }
    });

    basketIcon.addEventListener('click', () => {
        modalWindow.showModal();
        body.classList.add('hidden');
        checkState();
    });

    closeModalButton.addEventListener('click', () => {
        modalWindow.close();
        body.classList.remove('hidden');
        let quantityPlus = document.querySelectorAll('.card-quantity-up');
        let quantityMinus = document.querySelectorAll('.card-quantity-down');

        if (quantityPlus.length > 0 && quantityMinus > 0) {
            quantityPlus.forEach(el => {
                el.removeEventListener('click', test);
            })

            quantityMinus.forEach(el => {
                el.removeEventListener('click', test2);
            })
        }
    });

    /*Basket instructions*/
    basketButton.forEach(button => {
        button.addEventListener('click', () => {
            let parent = button.closest('.card-wrapper');
            let basketItems = document.querySelector('.list-of-goods');
            let basketCards = basketItems.querySelectorAll('.card-wrapper');
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
                basketItems.insertAdjacentHTML('afterbegin', htmlPosition);
                totalPrice = calculatePrice();
                let priceTag = `
                    <div class="total-price">Сумма: <span>${totalPrice}</span> руб.</div>
                `;
                basketItems.insertAdjacentHTML('beforeend', priceTag);
            } else {
                let productState = true;

                basketCards.forEach(el => {
                    if (Number(el.getAttribute('product-id')) === currentId) {
                        productState = false;
                    }
                })

                if (productState === true) {
                    basketItems.insertAdjacentHTML('afterbegin', htmlPosition);
                }
                
                totalPrice = calculatePrice();

                // Если тег уже существует внутри, то просто изменяем содержимое спана
                if(basketItems.querySelector('.total-price') != null) {
                    basketItems.querySelector('.total-price span').textContent = totalPrice;
                }
            }

            /*Clicked button animation*/
            button.classList.add('added');
            setTimeout(function() {
                button.classList.remove('added');
            }, 2000);

            checkState();
            checkBasketItems();
        });
    });

    // Функция проверки состояния корзины

    function checkState() {
        let basketItems = document.querySelector('.list-of-goods');
        let modalTitle = document.querySelector('.modal-wrapper .modal-title');
        let modalForm = document.querySelector('.modal-wrapper form');

        if (basketItems.innerHTML !== '') {
            backetHandler();
            modalTitle.style.display = null;
            modalForm.style.display = null;
            basketIcon.style.display = 'unset';
            
            if (basketItems.querySelector('.empty-basket')) {
                basketItems.querySelector('.empty-basket').remove();
            }

        } else {
            let noItemsText = `
            <div class="empty-basket">
                <i class="fa fa-shopping-basket" aria-hidden="true"></i>
                <p style="font-weight: 700;">Ваша корзина пуста</p>
                <p>Для оформления заказа добавьте нужные товары.</p>
            </div>
            `;
            basketItems.insertAdjacentHTML('afterbegin', noItemsText);
            modalTitle.style.display = 'none';
            modalForm.style.display = 'none';
            basketIcon.style.display = 'none';
        }
    }

    //Кнопки + - удаление в корзине

    function backetHandler() {
        let quantityPlus = document.querySelectorAll('.card-quantity-up');
        let quantityMinus = document.querySelectorAll('.card-quantity-down');
        let removeButton = document.querySelectorAll('.card-remove');
        let basketItems = document.querySelector('.list-of-goods');
        let totalPrice = 0;

        quantityPlus.forEach(el => {
            el.onclick = function(e) {
                e.preventDefault();
                let parent = el.closest('.card-quantity');
                parent.querySelector('.count').innerHTML = Number(parent.querySelector('.count').innerHTML) + 1;
                totalPrice = calculatePrice();
                
                if (basketIcon.style.display != 'none') {
                    basketItems.querySelector('.total-price span').textContent = totalPrice;
                }

                checkBasketItems()
            }
        })

        quantityMinus.forEach(el => {
            el.onclick = function(e) {
                e.preventDefault();
                let parent = el.closest('.card-quantity');
                parent.querySelector('.count').innerHTML = Number(parent.querySelector('.count').innerHTML) - 1;

                if(Number(parent.querySelector('.count').innerHTML) < 1) {
                    parent.closest('.card-wrapper').remove();

                    if(basketItems.querySelector('.total-price') != null) {
                        basketItems.querySelector('.total-price span').textContent = totalPrice;
                    }
                    
                    if(basketItems.querySelectorAll('.card-wrapper').length === 0) {
                        basketItems.querySelector('.total-price').remove();
                        basketItems.innerHTML = '';
                        // Здесь дописать чтобы форма скрывалась, т.к. ничего в корзине уже нет
                        checkState();
                    }
                }

                totalPrice = calculatePrice();
                
                if (basketIcon.style.display != 'none') {
                    basketItems.querySelector('.total-price span').textContent = totalPrice;
                }
                
                checkBasketItems();
            }
        })

        removeButton.forEach(el => {
            el.onclick = function(e) {
                e.preventDefault();
                let parent = el.closest('.card-quantity');
                parent.closest('.card-wrapper').remove();

                totalPrice = calculatePrice();

                if(basketItems.querySelector('.total-price') != null) {
                    basketItems.querySelector('.total-price span').textContent = totalPrice;
                }
                    
                if(basketItems.querySelectorAll('.card-wrapper').length === 0) {
                    if(basketItems.querySelector('.total-price') != null) {
                        basketItems.querySelector('.total-price').remove();
                    }
                    basketItems.innerHTML = '';
                    // Здесь дописать чтобы форма скрывалась, т.к. ничего в корзине уже нет
                    checkState();
                }

                checkBasketItems();
            }
        })
    }

    function checkBasketItems() {
        let basketItems = document.querySelector('.list-of-goods');
        let card = basketItems.querySelectorAll('.card-wrapper');
        let basketCounter = document.querySelector('.basket-counter');

        let quantity = 0;

        card.forEach(el => {
            let count = el.querySelector('.card-quantity .count').textContent;
            quantity += Number(count);
        })

        if (quantity > 0) {
            basketCounter.textContent = quantity;
        } else {
            basketCounter.textContent = '';
        }
        
    }

    function calculatePrice() {
        let basketItems = document.querySelector('.list-of-goods');
        let card = basketItems.querySelectorAll('.card-wrapper');
        

        let sum = 0;

        card.forEach(el => {
            let count = el.querySelector('.card-quantity .count').textContent;
            let amount = el.getAttribute('product-cost');
            let basketAmount = el.querySelector('.card-price .amount');
            
            basketAmount.textContent = Number(count) * Number(amount);
            
            sum += Number(basketAmount.textContent);
        })
        
        return sum;
    }
});