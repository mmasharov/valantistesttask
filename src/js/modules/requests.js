import md5 from "js-md5";
import { state } from "../script";

function genToken() {
    // строка авторизации на бэкенде
    const password = 'Valantis',
        curDate = new Date(),
        year = curDate.getFullYear(),
        month = curDate.getMonth() >= 9 ? (curDate.getMonth() + 1) : '0' + (curDate.getMonth() + 1),
        day = curDate.getDate() >=10 ? curDate.getDate() : '0' + curDate.getDate();
    return md5(`${password}_${year}${month}${day}`);
}

async function requestBackend(action) {
    // Запрос данных с бэкенда
    const res = await fetch(state['backend_url'], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': genToken()
            },
            body: JSON.stringify(action)
        });
    if (res.ok) {
        return await res.json();
    } else {
        console.log(`Failed to fetch backend data. Status: ${res.status}. Retrying now.`);
        return requestBackend(action);
    }
}

export { requestBackend };