let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

next.addEventListener("click", function() {
let items = document.querySelectorAll(".item");
document.querySelector('.slide').appendChild(items[0]);
});

prev.addEventListener("click", function(){
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').prepend(items[items.length - 1]);
})

let timeout = 7000;

let timeset = setInterval(function(){
    let items = document.querySelectorAll('.item');
    document.querySelector('.slide').appendChild(items[0]);
}, timeout);