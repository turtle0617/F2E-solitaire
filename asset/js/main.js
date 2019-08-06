main(52);

function main(cardNum) {
  const cardMap = new Map();
  let cards = new Array(cardNum).fill(1);
  const cardsColumns = [...document.querySelectorAll('.randomCards__column')];
  setCardNumber(cardMap);
  cards = cards.map(card => {
    const cardCol = getCardColumn(cardsColumns);
    const cardInfo = getRandomCard(1, 13, cardMap);
    generateCardElement(cardInfo, cardCol);
    return cardInfo
  })
}

function setCardNumber(cardMap) {
  cardMap.set('黑桃', new Array(13).fill(1).map((item, index) => (index + 1)))
  cardMap.set('愛心', new Array(13).fill(1).map((item, index) => (index + 1)))
  cardMap.set('方塊', new Array(13).fill(1).map((item, index) => (index + 1)))
  cardMap.set('梅花', new Array(13).fill(1).map((item, index) => (index + 1)))
}

function getRandomCard(min, max, cardMap) {
  const suit = getRandomSuit();
  const cardNum = getRandomInt(min, max);
  if (!cardMap.get(suit).includes(cardNum)) {
    // console.log('已被取過', suit, cardNum)
    // console.log('已被取過',cardMap.get(suit))
    return getRandomCard(1, 13, cardMap)
  }
  // console.log('不重複 刪除！', suit, cardNum)
  const deleteIndex = cardMap.get(suit).findIndex(item=>item===cardNum)
  cardMap.get(suit).splice(deleteIndex, 1)
  // console.log('刪除後：',cardMap.get(suit))
  return {
    suit,
    cardNum
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomSuit() {
  const suits = ['黑桃', '愛心', '方塊', '梅花']
  return suits[Math.floor(Math.random() * Math.floor(4))]
}

function generateCardElement(card, cardColumn) {
  const cardElement = document.createElement('div');
  const img = document.createElement('img');
  cardElement.setAttribute('class', 'card');
  img.setAttribute('src', `/asset/image/poke/${card.suit}${card.cardNum}.png`);
  cardElement.appendChild(img);
  cardColumn.appendChild(cardElement);
}

function getCardColumn(cardsColumns) {
  const chooseColumn = cardsColumns[getRandomInt(0, 7)];
  if (chooseColumn.children.length === 7) {
    return getCardColumn(cardsColumns)
  }
  return chooseColumn
}
