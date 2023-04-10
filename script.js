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
const meals = [
    {
        "name": "chicken",
        "description": "delicious chicken",
        "img": "chicken.jpeg",
        "stats": [0, .4, 0, .2, .1, 0, 0]
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
    }
];

function userAddPref(evt) {//vx, liked) {
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

    const elem = document.getElementById('predict');
    elem.querySelector("#predict-rating").innerHTML = Math.max(0, Math.min(5, (user.rate([.7,0,0,0,0,.5,0]) * 5).toFixed(1))) + " stars";
}