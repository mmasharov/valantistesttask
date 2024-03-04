import { initList } from "./modules/list";
import { controls } from "./modules/controls";
import { getBrands } from "./modules/search";

let state = {
    backend_url: 'https://api.valantis.store:41000/',
    offset: 0,
    itemsPerPage: 50,
    totalItems: 0,
    merchIds: []
};

window.addEventListener('DOMContentLoaded', () => {
    initList();
    controls();
    getBrands();
});

export { state };