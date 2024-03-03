import { state } from "../script";
import { requestBackend } from "./requests";

const pageInfo = document.querySelector('#pages'),
    list = document.querySelector('.merch__list_wrapper');

function filterIds(data) {
    // Отсеиваем дубли в массиве айдишников
    const filtered = data.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    state['merchIds'] = filtered;
    return filtered;
}

function filterItems(data) {
    // Отсеиваем дубли в массиве товаров
    let ids = [];
    let filtered = [];
    for (let item in data) {
        if (!ids.includes(data[item]['id'])) {
            ids.push(data[item]['id']);
            filtered.push(data[item]);
        }
    }
    return filtered;
}

function renderList(data) {
    // Заполнение блока с информацией о товаре
    list.innerHTML = '';
    for (let item in data) {
        const listItem = document.createElement('div');
        listItem.classList.add('merch__item');
        listItem.innerHTML = `
            <div class="merch__item_id">${data[item]['id']}</div>
            <div class="merch__item_name">${data[item]['product']}</div>
            <div class="merch__item_price">${data[item]['price']} руб.</div>
            <div class="merch__item_brand">${data[item]['brand'] ? data[item]['brand'] : '---'}</div>
        `;
        list.appendChild(listItem);
    }
}

function fillMerchList(ids, offset) {
    // Получение информации о товарах по айдишникам, отсеивание дублей, заполнение списка и инфы о странице списка
    state['totalItems'] = ids.length;
    pageInfo.textContent = `${state['totalItems'] > (offset + state['itemsPerPage']) ? (1 + offset) : '1'}-${state['totalItems'] > (offset + state['itemsPerPage']) ? (offset + state['itemsPerPage']) : state['totalItems']} / ${state['totalItems']}`;
    const merchIds = ids.slice(offset, offset + state['itemsPerPage']);
    const result = requestBackend({"action": "get_items", "params": {"ids": merchIds}})
            .then(res => filterItems(res['result']))
            .then(res => renderList(res))
            .catch(error => {
                console.log(error);
            });
    return result;
}

const initList = async () => {
    // Заполнение списка по умолчанию
    const result = requestBackend({ "action": "get_ids" })
            .then(res => filterIds(res['result']))
            .then(res => fillMerchList(res, state['offset']));
    return result;
};

export { filterIds, initList, fillMerchList };