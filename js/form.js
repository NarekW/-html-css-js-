let vkForm = document.querySelector('#myform');

let resultatsText = document.querySelector('#resText');
//

//Подключение media
let style_script = document.querySelector('link');

function changeMegia(x) {
    if (x.matches) {
        style_script.href = "./css/media.css";
    } else {
        style_script.href = "./css/form.css";
    }
}

let x = window.matchMedia("(max-width: 600px)")
changeMegia(x)
x.addListener(changeMegia)
//

function lazy(images) {

    let options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    }

    function handleImg(myImg, observer) {
        myImg.forEach(myImgSingle => {

            if (myImgSingle.intersectionRatio > 0) {
                loadImage(myImgSingle.target);
            }
        })
    }

    function loadImage(image) {
        image.src = image.getAttribute('data');
    }

    let observer = new IntersectionObserver(handleImg, options);

    images.forEach(img => {
        observer.observe(img);
    })
}


function Container(userData) {

    let template = document.querySelector('#usersInfo');
    let clone = document.importNode(template.content, true);

    let FIO = clone.querySelector('.FIO');

    let userLink = clone.querySelector('.profile_link');

    let userAvatar = clone.querySelector('#userAvatar');

    userAvatar.src = "./images/men.gif";
    userAvatar.setAttribute('data', `${userData.photo}`)

    userLink.href = "https://vk.com/id" + userData.id;
    userLink.textContent = "https://vk.com/id" + userData.id;

    FIO.textContent = `${userData.first_name} ${userData.last_name} ${userData.nickname}`;

    document.querySelector('#results').appendChild(clone);


}

function callbackFunc(result) {

    result.response.items.forEach(element => {
        console.log(element);
        Container(element);
    });
    resultatsText.textContent = `Наидено ${result.response.items.length} Человек`;
}
var valiudation = 0;

function getData(event) {
    event.preventDefault();
    resultatsText.textContent = ` `;

    let div = document.querySelector("#results");
    let elems = div.childNodes;

    if (elems.length > 0) {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }

    let day = event.target.elements[0].value;
    let month = event.target.elements[1].value;
    let year = event.target.elements[2].value;

    let birth_day = day; //День рождения
    let birth_month = month; //месяц рождения.
    let birth_year = year; //год рождени
    let token = "0ffa9401d680c1c9af2ab76840e4fd8060b3916ac7313b4cb766f85ae35f9347f80856200bb31234ec739";

    let errorText1 = document.querySelector('#err_day');
    let errorText2 = document.querySelector('#err_year');
    let errorText3 = document.querySelector('#err_mont');

    if (day > 31 || day < 1 || isNaN(day)) {
        let errorMessage = "Не меньше 1 и не больше 31  / только цифры";
        errorText2 = document.querySelector('#err_year').textContent = '';
        errorText3 = document.querySelector('#err_mont').textContent = ' ';
        valiudation = 1;
        errorText1.textContent = errorMessage;
        return;
    }
    if (year > 1999 || year < 1979 || isNaN(year)) {
        let errorMessage = "Возраст должен быть не менее 20 и не более 40 лет / только цифры";
        errorText1 = document.querySelector('#err_day').textContent = ' ';
        errorText3 = document.querySelector('#err_mont').textContent = ' ';
        valiudation = 1;   
        errorText2.textContent = errorMessage;
        return;
    }
    if (month > 12 || month < 1 || isNaN(month)) {
        let errorMessage = "Не меньше 1 и не больше 12 / только цифры";
        valiudation = 1;
        errorText1 = document.querySelector('#err_day').textContent = ' ';
        errorText2 = document.querySelector('#err_year').textContent = '';
        errorText3.textContent = errorMessage;
        return;
    }
    else{
      
            errorText1 = document.querySelector('#err_day').textContent = ' ';
            errorText2 = document.querySelector('#err_year').textContent = '';
            errorText3 = document.querySelector('#err_mont').textContent = ' ';
            valiudation = 0;
    }

    resultatsText.textContent = `Загрузка...`;

    let array = [`birth_year=${birth_year}`, `birth_month=${birth_month}`, `birth_day=${birth_day}`, `count=1000`, `fields=photo, nickname`];
    let params = array.join('&');

    let users_search_url = `https://api.vk.com/method/users.search?${params}&v=5.52&access_token=${token}&callback=callbackFunc`;

    let script = document.createElement('SCRIPT');

    script.src = users_search_url;
    document.getElementsByTagName("head")[0].appendChild(script);

    script.onload = function () {
        console.log('Все данные получены!');
        let images = document.querySelectorAll('img');
        lazy(images);

    };
}

vkForm.addEventListener('submit', getData);