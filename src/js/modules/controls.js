import { state } from "../script";
import { fillMerchList, initList } from "./list";
import { searchList } from "./search";

const nextButton = document.querySelector('#next'),
    prevButton = document.querySelector('#prev'),
    searchBtn = document.querySelector('#search-commit'),
    resetBtn = document.querySelector('#search-reset'),
    searchProduct = document.querySelector('#search-product'),
    searchPrice = document.querySelector('#search-price'),
    searchBrand = document.querySelector('#search-brand'),
    list = document.querySelector('.merch__list_wrapper');

function offsetChange(value, callback) {
    // Изменение состояния при переключении страниц для вычисления текущих номеров из общего числа
    state['offset'] += value;
    if (state['offset'] >= state['totalItems'] || state['totalItems'] - state['itemsPerPage'] < 0) {
        state['offset'] = 0;
    }
    if (state['offset'] < 0) {
        state['offset'] = state['totalItems'] - state['itemsPerPage'];
    }
    callback();
}

const controls = () => {
    // Обработчики событий кнопок управления
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        offsetChange(50, () => {
            list.innerHTML = '';
            try {
                fillMerchList(state['merchIds'], state['offset']);
            } catch (error) {
                console.log(error);
                fillMerchList(state['merchIds'], state['offset']);
            }
        });
    });
    
    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        offsetChange(-50, () => {
            list.innerHTML = '';
            try {
                fillMerchList(state['merchIds'], state['offset']);
            } catch (error) {
                console.log(error);
                fillMerchList(state['merchIds'], state['offset']);
            }
        });
    });
    
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchList().then(data => fillMerchList(data, state['offset']));
    });
    
    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchProduct.value = '';
        searchPrice.value = '';
        searchBrand.value = '';
        initList();
    });
    
    searchProduct.addEventListener('focus', (e) => {
        e.preventDefault();
        searchPrice.value = '';
        searchBrand.value = '';
    });
    searchProduct.addEventListener('keypress', (e) => {
        // в поле поиска по названию можно вводить только руссике и английские буквы
        if (e.key.match(/[^а-яё a-z]/ig)) {
            e.preventDefault();
        }
    });
    searchPrice.addEventListener('focus', (e) => {
        e.preventDefault();
        searchProduct.value = '';
        searchBrand.value = '';
    });
    searchPrice.addEventListener('input', () => {
        // в поле поиска по цене можно вводить только цифры и точку
        searchPrice.value = searchPrice.value.replace(/[^\.\d\s]/, '');
    });
    searchBrand.addEventListener('focus', (e) => {
        e.preventDefault();
        searchPrice.value = '';
        searchProduct.value = '';
    });
};

export { controls };