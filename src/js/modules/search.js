import { state } from "../script";
import { requestBackend } from "./requests";
import { filterIds } from "./list";

const searchProduct = document.querySelector('#search-product'),
    searchPrice = document.querySelector('#search-price'),
    searchBrand = document.querySelector('#search-brand');

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

export { searchList };