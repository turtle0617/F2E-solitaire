main(52);

function main(cardNum) {
  const randomCardMap = setCardNumber(cardNum);
  const cargGroup = sliceCardToGroup(randomCardMap, 4, 7);
  const randomCardContainer = [...document.querySelectorAll('.randomCards__column')];
  const countStorages = [...document.querySelectorAll('.countStorages__item')];
  const temporaryStorages = [...document.querySelectorAll('.temporaryStorages__item')];
  randomCardContainer.forEach((column, index) => {
    initColumnByRandomElementEvent(column)
    cargGroup[index].forEach(card => column.appendChild(generateCardElement(card)))
  })
  countStorages.forEach(count => initDropedElementEvent(count, "count"))
  temporaryStorages.forEach(temporary => initDropedElementEvent(temporary, "temporary"))
}

function dragCard(e) {
  const cardColumn = this.parentNode;
  const allCardsInColumn = [...cardColumn.children]
  const isLastCard = cardColumn.lastChild === this;
  const isOrder = checkCardOrderUntilEnd(this, allCardsInColumn);
  if (!isLastCard && !isOrder) {
    e.preventDefault();
    return;
  };
  const currentCardIndex = allCardsInColumn.findIndex((card) => card === this);
  const currentCardUntilEndId = allCardsInColumn
    .filter((card, index) => index >= currentCardIndex)
    .map(card => getCardId(card))
    .join(',')
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.setData('text/plain', currentCardUntilEndId);
  this.style.opacity = '0.4';
}

function dropCard(e) {
  this.style.opacity = '1';
}

function initDropedElementEvent(item, status) {
  item.addEventListener('dragenter', function(e) {
    this.classList.add('over');
  })
  item.addEventListener('dragleave', function(e) {
    this.classList.remove('over');
  })
  item.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
  })
  if (status === "temporary")
    return item.addEventListener('drop', temporaryElementDrop)
  item.addEventListener('drop', coutElementDrop)
}

function initColumnByRandomElementEvent(column) {
  column.addEventListener('dragenter', function(e) {
    this.classList.add('over');
  })
  column.addEventListener('dragleave', function(e) {
    this.classList.remove('over');
  })
  column.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
  })
  column.addEventListener('drop', columnByRandomElementDrop)
}

function coutElementDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  this.classList.remove('over');
  const dropCardId = e.dataTransfer.getData("text").split(',');
  if (dropCardId.length > 1) return;

  const dropCard = document.getElementById(dropCardId.join(''));
  const hasCardCount = this.children.length;
  if (hasCardCount) {
    const isSameSuit = checkCardSuit(dropCard, this.children[0]);
    const order = checkCardOrder(dropCard, this.lastChild, "increment")
    if (!isSameSuit || !order) return
  } else {
    const isAce = getCardNumber(dropCard) === 1;
    if (!isAce) return;
  }
  this.appendChild(dropCard);
}

function temporaryElementDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  this.classList.remove('over');
  const dropCardId = e.dataTransfer.getData("text").split(',');
  if (dropCardId.length > 1) return;
  const dropCard = document.getElementById(dropCardId.join(''));
  const hasCardCount = this.children.length;
  if (hasCardCount) return;
  this.appendChild(dropCard);
}

function columnByRandomElementDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  this.classList.remove('over');
  const cardGroup = e.dataTransfer.getData("text").split(',');
  const firtCardInGroup = document.getElementById(cardGroup[0]);
  const meetRule = compareCardMeetsTheRule(this.lastChild, firtCardInGroup);
  if (!meetRule) return;
  cardGroup.forEach(cardId => {
    const dropCard = document.getElementById(cardId);
    this.appendChild(dropCard);
  })
}

function setCardNumber(cardNum) {
  return Array(cardNum).fill(1).map((item, index) => {
      index += 1;
      if (index <= 13)
        return `黑桃${index}`
      else if (index > 13 && index <= 26)
        return `愛心${index-13}`
      else if (index > 26 && index <= 39)
        return `方塊${index-26}`
      else if (index > 39)
        return `梅花${index-39}`
    })
    .sort((a, b) => (Math.random() - 0.5))
}

function sliceCardToGroup(cards, groups, position) {
  return Array(groups).fill(1)
    .map((group, index) => {
      group = cards.slice(index * 13, ((index + 1) * 13))
      return [group.slice(0, position), group.slice(position)]
    })
    .flat()
    .sort((a, b) => (b.length - a.length))
}

function generateCardElement(card) {
  const cardElement = document.createElement('div');
  const img = document.createElement('img');
  cardElement.setAttribute('class', 'card');
  cardElement.setAttribute('id', card);
  cardElement.setAttribute('draggable', 'true');
  img.setAttribute('src', `/asset/image/poke/${card}.png`);
  cardElement.appendChild(img);
  cardElement.addEventListener('dragstart', dragCard);
  cardElement.addEventListener('dragend', dropCard);
  return cardElement
}

function checkCardSuit(droppedCard, bottomCard) {
  const suit = getCardSuit(bottomCard);
  const droppedCard_suit = getCardSuit(droppedCard)
  return suit === droppedCard_suit;
}

function checkCardOrder(droppedCard, previousCard, status) {
  status = status === "increment" ? 1 : -1;
  const previousCard_num = getCardNumber(previousCard)
  const droppedCard_num = getCardNumber(droppedCard)
  return (droppedCard_num - previousCard_num) === status;
}

function checkCardOrderUntilEnd(currentCard, allCards) {
  const currentCardIndex = allCards.findIndex((card) => card === currentCard);
  const currentCardUntilEnd = allCards.filter((card, index) => index >= currentCardIndex);
  return currentCardUntilEnd.every((card, index, cardGroup) => {
    const isLast = index === (cardGroup.length - 1)
    if (isLast) return true;
    return compareCardMeetsTheRule(card,cardGroup[index + 1])
    // const currentSuit = converCardSuitToColor(card);
    // const nextSuit = converCardSuitToColor(cardGroup[index + 1]);
    // const currentNum = getCardNumber(card);
    // const nextNum = getCardNumber(cardGroup[index + 1]);
    // if (currentSuit !== nextSuit && (currentNum - nextNum) === 1)
    //   // if ((currentNum - nextNum) === -1)
    //   return true;
    // return false
  })
}

function compareCardMeetsTheRule(currentCard, nextCard) {
  const currentSuit = converCardSuitToColor(currentCard);
  const nextSuit = converCardSuitToColor(nextCard);
  const currentNum = getCardNumber(currentCard);
  const nextNum = getCardNumber(nextCard);
  return currentSuit !== nextSuit && (currentNum - nextNum) === 1
}

function converCardSuitToColor(card) {
  const suit = getCardSuit(card);
  return suit === '愛心' || suit === '方塊' ? 'red' : 'black'
}

function getCardSuit(card) {
  return card.getAttribute('id').replace(/(\d+)/, "")
}

function getCardNumber(card) {
  return parseInt(card.getAttribute('id').replace(/^(\D+)/, ""))
}

function getCardId(card) {
  return card.getAttribute('id')
}
