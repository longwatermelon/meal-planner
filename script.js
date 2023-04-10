class User
{
    constructor(n) {
        this.vw = new Array(n).fill(0);
        this.b = 0;
        this.mlikes = new Array();
        this.mdislikes = new Array();
    }

    like(vx) { this.mlikes.push(vx); }
    dislike(vx) { this.mdislikes.push(vx); }

    rate(vx)
    {
        let sum = 0;
        for (let i = 0; i < this.vw.length; i++)
            sum += this.vw[i] * vx[i];
        return sum + this.b;
    }

    train()
    {
        for (let k = 0; k < 1000; ++k)
        {
            const mx = this.mlikes.concat(this.mdislikes);
            let vy = new Array(mx.length);
            for (let i = 0; i < mx.length; ++i)
                vy[i] = i <= this.mlikes.length - 1;

            let db_j = 0;
            for (let i = 0; i < mx.length; ++i)
                db_j += this.rate(mx[i]) - vy[i];
            db_j /= mx.length;
            const b_new = this.b - 0.1 * db_j;

            let vw_new = new Array(this.vw.length);
            for (let j = 0; j < this.vw.length; ++j)
            {
                let dw_j = 0;
                for (let i = 0; i < mx.length; ++i)
                    dw_j += (this.rate(mx[i]) - vy[i]) * mx[i][j];
                dw_j /= mx.length;
                vw_new[j] = this.vw[j] - 0.1 * dw_j;
            }

            this.b = b_new;
            this.vw = vw_new;
        }
    }
}

localStorage.setItem('user', JSON.stringify(new User(7)));

// stats: sweet, salty, sour, bitter, savory, fatty, spicy
let meals = [
    {
        "name": "chicken",
        "description": "delicious chicken",
        "img": "chicken.jpeg",
        "stats": [0, .4, 0, .2, .5, 0, 0]
    },
    {
        "name": "sugar",
        "description": "scrumptious snack",
        "img": "sugar.png",
        "stats": [1, 0, 0, 0, 0, .2, 0]
    },
    {
        "name": "salt",
        "description": "salty delight",
        "img": "salt.png",
        "stats": [0, 1, 0, 0, .5, 0, 0]
    },
    {
        "name": "honey mustard",
        "description": "delightful treat",
        "img": "honey-mustard.jpeg",
        "stats": [.4, .6, .3, .1, .2, 0, 0]
    },
    {
        "name": "honey",
        "description": "scrumptious delight",
        "img": "honey.jpg",
        "stats": [1, 0, 0, 0, 0, 0, 0]
    },
    {
        "name": "hot cheetos",
        "description": "delicious spicy snack",
        "img": "hot-cheetos.png",
        "stats": [0, .8, 0, 0, .6, 0, 1]
    },
    {
        "name": "watermelon",
        "description": "enjoyable fruit",
        "img": "watermelon.jpeg",
        "stats": [.5, 0, 0, 0, 0, 0, 0]
    }
];

{
    const mealsPrev = meals.map((x) => x);
    const len = meals.length;
    for (let i = 0; i < len; ++i)
        meals.splice(meals.indexOf(addMeal()), 1);
    meals = mealsPrev.map((x) => x);
}


function getUser() {
    const s = localStorage.getItem('user');
    const user_s = JSON.parse(s);
    const user = new User(user_s.vw.length);
    user.vw = user_s.vw;
    user.b = user_s.b;
    user.mlikes = user_s.mlikes;
    user.mdislikes = user_s.mdislikes;
    return user;
}

function updateDisplayPref() {
    const user = getUser();
    const prefs = document.getElementById('pref');
    for (let i = 0; i < user.vw.length; ++i)
        user.vw[i] = user.vw[i].toFixed(2);
    prefs.innerText = "Sweet " + user.vw[0] + "\nSalty " + user.vw[1] + "\nSour " + user.vw[2] + "\nBitter " + user.vw[3] + "\nSavory " + user.vw[4] + "\nFatty " + user.vw[5] + "\nSpicy " + user.vw[6];
}

function userAddPref(evt) {
    const name = evt.currentTarget.name;
    const vx = evt.currentTarget.vx;
    const liked = evt.currentTarget.liked;

    const s = localStorage.getItem('user');
    const user_s = JSON.parse(s);
    const user = new User(user_s.vw.length);
    user.vw = user_s.vw;
    user.b = user_s.b;
    user.mlikes = user_s.mlikes;
    user.mdislikes = user_s.mdislikes;

    if (liked) user.like(vx);
    else user.dislike(vx);
    user.train();

    localStorage.setItem('user', JSON.stringify(user));

    removeMeal(name);

    document.getElementById('meals').innerHTML = '';
    const mealsPrev = meals.map((x) => x);
    const len = meals.length;
    console.log(len);
    for (let i = 0; i < len; ++i)
        meals.splice(meals.indexOf(addMeal()), 1);
    meals = mealsPrev.map((x) => x);

    updateDisplayPref();
    // const elem = document.getElementById('predict');
    // elem.querySelector("#predict-rating").innerHTML = Math.max(0, Math.min(5, (user.rate([.7,0,0,0,0,.5,0]) * 5).toFixed(1))) + " stars";
}

function removeMeal(name) {
    const mealsContainer = document.getElementById('meals');
    let subdivs = mealsContainer.getElementsByTagName('div');
    for (let i = 0; i < subdivs.length; ++i)
    {
        if (subdivs[i].name == name)
        {
            meals.splice(meals.indexOf(subdivs[i].mealObject), 1);
            break;
        }
    }
}

function addMeal() {
    if (meals.length == 0)
        return;

    const mealsContainer = document.getElementById('meals');
    const meal = document.createElement('div');

    let highest_rating = -1000;
    let mealObject = meals[0];
    const user = getUser();
    for (let i = 0; i < meals.length; ++i)
    {
        const rating = user.rate(meals[i].stats);
        if (rating > highest_rating)
        {
            highest_rating = rating;
            mealObject = meals[i];
        }
    }

    console.log(mealObject["name"]);

    // const mealObject = meals[Math.floor(Math.random() * meals.length)];
    meal.mealObject = mealObject;
    meal.name = mealObject["name"];

    // meals.splice(meals.indexOf(mealObject), 1);

    const image = document.createElement('img');
    image.src = mealObject["img"];
    meal.appendChild(image);

    const text = document.createElement('p');
    text.innerHTML = "<b>" + mealObject["name"] + "</b><br>" + mealObject["description"];
    meal.appendChild(text);

    const like = document.createElement('button');
    like.innerText = "Like";
    like.addEventListener("click", userAddPref, false);
    like.name = mealObject["name"];
    like.vx = mealObject["stats"];
    like.liked = true;
    meal.appendChild(like);

    const dislike = document.createElement('button');
    dislike.innerText = "Dislike";
    dislike.addEventListener("click", userAddPref, false);
    dislike.name = mealObject["name"];
    dislike.vx = mealObject["stats"];
    dislike.liked = false;
    meal.appendChild(dislike);

    mealsContainer.appendChild(meal);

    return mealObject;
}
