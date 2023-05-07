const url = 'https://script.google.com/macros/s/AKfycbzXrX37uW8HxithTVc0MS8gL4xgbwr3aBKuK2iSZVI_BGFFIku8xGHuFo_oyQoZAgTtvg/exec';

const output = document.querySelector('.output');
const game = { question: 0, total: 0, data: [], score: 0 };

document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('ready');
  output.innerHTML = '';
  const btn = document.createElement('button');
  btn.disabled = true;
  start(btn);
  game.question = 0;
  game.total = 0;
  game.score = 0;
  game.data = [];

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      game.total = data.data.length;
      game.data = data.data;
      btn.disabled = false;
    });
}

function start(btn) {
  const html = 'Welcome to the quiz. Press the button below to start the QUIZ.';
  const div = maker('div', html, 'message', output);
  btn.textContent = 'Start Game';
  btn.classList.add('btn');
  div.append(btn);
  btn.addEventListener('click', loaderQuestion);
}

function loaderQuestion() {
  output.innerHTML = '';
  if (game.question >= game.total) {
    const html = `<h1>Game Over</h1><div>You got ${game.score} out of ${game.total} correct.</div>`;
    const div = maker('div', html, 'message', output);
    const btn3 = maker('button', 'Play Again', 'btn', div);
    btn3.addEventListener('click', init);
  } else {
    const div = maker('div', '', 'message', output);
    const val = game.data[game.question];
    const question = maker('div', `<strong>Question ${game.question+1}/${game.total}:</strong> ${val.question}?`, 'question', div);
    const optList = maker('div', '', 'opts', div);

    // shuffle the answer options
    const shuffledOptions = shuffle(val.arr);

    shuffledOptions.forEach(opt => {
      const temp = maker('div', opt, 'box', optList);
      temp.classList.add('box1');
      temp.myObj = {
        opt: opt,
        answer: val.answer
      };
      temp.addEventListener('click', checker);
    });

    const showButton = maker('button', 'Show More Details', 'btn', div);
    showButton.classList.add('show-button');
    if (val.moreDetails) {
      showButton.classList.add('details-available');
    }
    showButton.addEventListener('click', () => {
      if (val.moreDetails) {
        const details = maker('div', val.moreDetails, 'details', div);
        showButton.style.display = 'none';
      }
    });

    // Add previous question button
    const prevButton = maker('button', 'Previous Question', 'btn', div);
    prevButton.classList.add('prev-button');
    if (game.question === 0) {
      prevButton.disabled = true;
    }
    prevButton.addEventListener('click', () => {
      game.question--;
      loaderQuestion();
    });

    // Add next question button
    const nextButton = maker('button', 'Next Question', 'btn', div);
    nextButton.classList.add('next-button');
    if (game.question === game.total - 1) {
      nextButton.textContent = 'End Game';
    }
    nextButton.addEventListener('click', () => {
      game.question++;
      loaderQuestion();
    });
  }
}



function showDetails(e) {
  const parent = e.target.parentElement;
  const val = parent.myObj;
  const moreDetails = maker('div', val.moreDetails, 'more-details', parent);
  moreDetails.style.fontSize = '50px';
  parent.removeChild(e.target);
}


// Fisher-Yates shuffle algorithm
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}




function checker(e) {
  const val = e.target.myObj;
  removerClicks();
  e.target.style.color = 'white';
  let html = '';
  if (val.opt === val.answer) {
    game.score++;
    e.target.style.backgroundColor = 'green';
    html = 'Correct!';
  } else {
    e.target.style.backgroundColor = 'red';
    // Find the element with the correct answer and mark it green
    const correctOption = Array.from(e.target.parentElement.children).find(child => child.myObj.opt === val.answer);
    correctOption.style.backgroundColor = 'green';
    html = 'Wrong!';
  }
  const parent = e.target.parentElement;
  game.question++;
  const rep = game.question == game.total ? 'End Game' : 'Next Question';
  const feedback = maker('div', html, 'message', parent);
  const btn2 = maker('button', rep, 'btn', parent);
  btn2.addEventListener('click', loaderQuestion);
}


function removerClicks() {
  const boxes = document.querySelectorAll('.box');
  boxes.forEach(ele => {
    ele.removeEventListener('click', checker);
    ele.style.color = '#add';
    ele.classList.remove('box1');
  });
}

function maker(eleType, html, cla, parent) {
  const ele = document.createElement(eleType);
  ele.innerHTML = html;
  ele.classList.add(cla);
  if (cla === 'details') {
    ele.style.fontSize = '50px';
  }
  return parent.appendChild(ele);
}
