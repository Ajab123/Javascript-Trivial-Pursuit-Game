const PubSub = require('../helpers/pub_sub.js');

const RollView = function () {
}

RollView.prototype.bindEvents = function () {
  PubSub.subsribe('Game:current-player', (evt) => {
    const playerId = evt.detail;
    this.render(playerId)
  })
};

RollView.prototype.render = function (playerId) {
  const parentElement = document.querySelecor('#display-view');

  const rollContainer = document.createElement('div');
  rollContainer.classList.add('roll-container');
  parentElement.appendChild(rollContainer);

  const instruction = document.createElement('p');
  instruction.textContent = `Player ${playerId}, it's your turn!`;
  rollContainer.appendChild(instruction);

  const rollButton = document.createElement('button');
  rollButton.textContent = 'Roll!'
  rollContainer.appendChild(rollButton);

  rollButton.addEventListener('click', (evt) => {
    PubSub.subscribe('Player:roll-result', (evt) => {
      const numRolled = evt.detail;
      const numRolledElement = document.createElement('p');
      numRolledElement.textContent = `${numRolled}`;
      rollContainer.appendChild(numRolledElement);
    });
    PubSub.publish('RollView:dice-clicked', playerId);
  });
}

  module.exports = RollView;
