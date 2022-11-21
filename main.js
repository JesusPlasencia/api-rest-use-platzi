const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
});
api.defaults.headers.common['X-API-KEY'] = 'live_r2PzzpQWRBotxueaMbYLzZGB1MEfojehzjO9US3mWh2MbVBqgxURb68kfJqGPTcx';

const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=2&api_key=live_r2PzzpQWRBotxueaMbYLzZGB1MEfojehzjO9US3mWh2MbVBqgxURb68kfJqGPTcx";
const API_URL_FAVOURITES = "https://api.thecatapi.com/v1/favourites?limit=5&api_key=live_r2PzzpQWRBotxueaMbYLzZGB1MEfojehzjO9US3mWh2MbVBqgxURb68kfJqGPTcx&order=DESC";
const API_URL_POST_FAVOURITE = "https://api.thecatapi.com/v1/favourites";
const API_URL_POST_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const btn = document.querySelector('button');
const spanError = document.getElementById('error');

async function loadRandomKitties() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();
    console.log('Random');
    console.log(data);
    
    if (res.status != 200) {
        spanError.innerHTML = "Error " + res.status;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        img1.src = data[0].url;
        img1.width = 150;
        img2.src = data[1].url;
        img2.width = 150;

        const btn1 = document.getElementById('btnRandom1');
        const btn2 = document.getElementById('btnRandom2');

        btn1.onclick = async () => {
            await saveFavouriteKitty(data[0].id);
            window.location.reload();
        }
        btn2.onclick = async () => {
            await saveFavouriteKitty(data[1].id);
            window.location.reload();
        }
    }
}

async function loadFavouritesKitties() {
    let res = await fetch(API_URL_FAVOURITES);
    let data = await res.json();
    console.log('Favourites');
    console.log(data);

    if (res.status != 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + " " + data.message;
    } else {
        for (let cat of data) {
            if (cat.image.url == undefined) {
                continue;
            }
            const section = document.getElementById('favouriteMichis');
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');

            btn.appendChild(btnText);
            btn.onclick = async () => {
                await deleteFavouriteKitty(cat.id);
                window.location.reload();
            };
            img.src = cat.image.url;
            img.width = 150;
            article.appendChild(img);
            article.appendChild(btn);

            section.append(article);
        };
    }
}

async function saveFavouriteKitty(id) {
    
    // const res = await fetch(API_URL_POST_FAVOURITE, {
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json",
    //         'x-api-key': 'live_r2PzzpQWRBotxueaMbYLzZGB1MEfojehzjO9US3mWh2MbVBqgxURb68kfJqGPTcx'
    //     },
    //     body: JSON.stringify({
    //         image_id:id
    //     })
    // });

    // const data = await res.json();
    const { data, status } = await api.post('/favourites', {
        image_id: id
    });

    console.log('Save');
    console.log(data);

    if (status != 200) {
        spanError.innerHTML = "Hubo un error: " + status + " " + data.message;
    }
}

async function deleteFavouriteKitty(id) {
    const res = await fetch(`${API_URL_POST_FAVOURITE}/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'x-api-key': 'live_r2PzzpQWRBotxueaMbYLzZGB1MEfojehzjO9US3mWh2MbVBqgxURb68kfJqGPTcx'
        },
    });
    const data = await res.json();
    console.log('Deleting');
    console.log(res);

    if (res.status != 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + " " + data.message;
    }
}

async function uploadCatPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    console.log(formData.get('file'));

    const res = await fetch(API_URL_POST_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': "multipart/form-data;",
            'x-api-key': 'live_r2PzzpQWRBotxueaMbYLzZGB1MEfojehzjO9US3mWh2MbVBqgxURb68kfJqGPTcx'
        },
        body: formData,
    });
}

// saveFavouriteKitty();
loadRandomKitties();
loadFavouritesKitties()