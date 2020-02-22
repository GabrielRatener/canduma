
const NS = `/api`;

export const querify = (obj) => {
    const queryComponents = [];

    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined || value === null) {
            throw new Error('Query string value cannot be null or undefined');
        }

        queryComponents.push(`${key}=${encodeURIComponent(value)}`);
    }

    return queryComponents.join('&');
}

export const get = (subPath, data = {}) => {
    const path = `${NS}/${subPath}`;
    const queryString = querify(data);
    const url =
      (queryString.length > 0) ?
        `${path}?${queryString}` :
        path;
    
    return new Promise((win, fail) => {
        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    win(xhr.response);
                } else {
                    fail(new Error(`Invalid XHR response: ${xhr.status}`));
                }
            }
        }

        xhr.open('GET', url, true);

        xhr.send();
    });
}

export const post = (subPath, data = {}) => {
    const url = `${NS}/${subPath}`;
    
    return new Promise((win, fail) => {
        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    win(xhr.response);
                } else {
                    fail(new Error(`Invalid XHR response: ${xhr.status}`));
                }
            }
        }

        xhr.open('POST', url, true);

        xhr.setRequestHeader("Content-type", "application/json");

        xhr.send(JSON.stringify(data));
    });
}