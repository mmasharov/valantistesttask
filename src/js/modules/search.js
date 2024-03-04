import { state } from "../script";
import { requestBackend } from "./requests";
import { filterIds } from "./list";

const searchProduct = document.querySelector('#search-product'),
    searchPrice = document.querySelector('#search-price'),
    searchBrand = document.querySelector('#search-brand');

function filterBrands(data) {
    const brands = data['result'].filter((b) => b != null);
    const filtered = brands.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    return filtered;
}

function renderBrandsSelect(data) {
    for (let item of data) {
        const elem = document.createElement('option');
        elem.textContent = item;
        searchBrand.appendChild(elem);
    }
}

function getBrands() {
    // Заполняем выпадающий список для поиска по бренду
    const brands = requestBackend({"action": "get_fields", "params": {"field": "brand"}})
        .then(res => filterBrands(res))
        .then(res => renderBrandsSelect(res));
    return brands;
}

function searchList() {
    // Поиск посредством бэкенда
    let params = {};
    state['offset'] = 0;
    if (searchProduct.value) {
        params['product'] = searchProduct.value;
    }
    if (searchPrice.value) {
        params['price'] = parseFloat(searchPrice.value);
    }
    if (searchBrand.value) {
        params['brand'] = searchBrand.value
    }
    if (!(Object.keys(params).length === 0)) {
        return requestBackend({"action": "filter", "params": params})
            .then(res => filterIds(res['result']))
            .catch(error => console.log(error));
    }
}

export { searchList, getBrands };