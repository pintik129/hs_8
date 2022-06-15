'use strict';

let wrapper = document.querySelector('#wrapper');

let posts = [];

class Post { // Получаем пост, данные юзера и карточку поста.

    view;

    render() {
        this.view = document.createElement('div');
        this.view.classList.add('card', 'm-3');
        this.view.style.width ='80%';
        this.view.innerHTML = `
            <div class="card-content">
                <div class="media">
                <div class="media-left">
                </div>
                <div class="media-content">
                    <p class="title is-1">${this.data.user.name}</p>
                    <p class="subtitle is-3">${this.data.user.email}</p>
                </div>
                </div>

                <div class="content">${this.data.post.body}</div>
            </div>
        `;
    }

    /**
     * @param {{post: *, user}} data
     */
    constructor(data) {
        this.data = data;
        this.render();
    }
}
/**
 * @param {string} method
 */
const getData = async (method) => {     //Получаем инфу с сервера
    const response = await fetch(`https://jsonplaceholder.typicode.com/${method}`);
    return await response.json();
};;

//Тут у нас парсинг массива от полученных постов и создается массив постов по классу Post
function parsingPosts(postsData, users) {
    let posts = [];
    for(let postData of postsData) {
        let user = users.filter(user => user.id == postData.userId)[0];
        posts.push(new Post({'post': postData, 'user': user}));
    }
    return posts;
}

//Рендерим посты
function renderPosts(posts, wrapper) {
    for(let post of posts) {
        wrapper.appendChild(post.view);
    }
}

getData('posts')
    .then((posts) => {
        if(localStorage.getItem('users')) {                             //Проверка данных в на локальном хранилище и загружаем, если есть
            let users = JSON.parse(localStorage.getItem('users'));
            renderPosts(parsingPosts(posts, users), wrapper);
        } else {
            getData('users')                                            //Если нет, сохраняем его с сервера на машину
                .then((users) => {
                    localStorage.setItem('users', JSON.stringify(users));
                    renderPosts(parsingPosts(posts, users), wrapper);
                });
        };
    });


