main(52);

function main(cardNum) {
  const randomCardMap = setCardNumber(cardNum);
  const cargGroup = sliceCardToGroup(randomCardMap, 4, 7);
  const cardsColumns = [...document.querySelectorAll('.randomCards__column')];
  const countStorages = [...document.querySelectorAll('.countStorages__item')];
  const temporaryStorages = [...document.querySelectorAll('.temporaryStorages__item')];
  cardsColumns.forEach((column, index) => {
    cargGroup[index].forEach(card => column.appendChild(generateCardElement(card)))
  })
  countStorages.forEach(count => initDropedElementEvent(count, "count"))
  temporaryStorages.forEach(temporary => initDropedElementEvent(temporary, "temporary"))
}

function dragCard(e) {
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.setData('text/plain', this.id);
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

function coutElementDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  this.classList.remove('over');
  const dropCard = document.getElementById(e.dataTransfer.getData("text"));
  const hasCardCount = this.children.length;
  if (hasCardCount) {
    const isSameSuit = checkCardSuit(dropCard, this.children[0]);
    const order = checkCardOrder(dropCard, this.lastChild)
    if (!isSameSuit || !order) return
  } else {
    const isAce = parseInt(dropCard.getAttribute('id').replace(/^(\D+)/, "")) === 1;
    if (!isAce) return;
  }
  this.appendChild(dropCard);
}

function temporaryElementDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  this.classList.remove('over');
  const dropCard = document.getElementById(e.dataTransfer.getData("text"));
  const hasCardCount = this.children.length;
  if (hasCardCount) return;
  this.appendChild(dropCard);
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
  const suit = bottomCard.getAttribute('id').replace(/(\d+)/, "");
  const droppedCard_suit = droppedCard.getAttribute('id').replace(/(\d+)/, "");
  return suit === droppedCard_suit;
}

function checkCardOrder(droppedCard, previousCard) {
  const previousCard_num = parseInt(previousCard.getAttribute('id').replace(/^(\D+)/, ""));
  const droppedCard_num = parseInt(droppedCard.getAttribute('id').replace(/^(\D+)/, ""));
  return (droppedCard_num - previousCard_num) === 1;
}
