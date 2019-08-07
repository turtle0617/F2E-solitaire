main(52);

function main(cardNum) {
  const randomCardMap = setCardNumber(cardNum);
  const cargGroup = sliceCardToGroup(randomCardMap, 4, 7);
  const cardsColumns = [...document.querySelectorAll('.randomCards__column')];
  const countStorages = [...document.querySelectorAll('.countStorages__item')];
  const temporaryStorages = [...document.querySelectorAll('.temporaryStorages__item')];
  cardsColumns.forEach((column, index) => {
    cargGroup[index].forEach(card =>column.appendChild(generateCardElement(card)))
  })
  countStorages.forEach(count=>initDropedItemEvent(count))
  temporaryStorages.forEach(count=>initDropedItemEvent(count))
}

function dragCard(e) {
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.setData('text/plain', this.id);
  this.style.opacity = '0.4';
}
function dropCard(e) {
  console.log('dropCard',e.target);
  this.style.opacity = '1';
}

function initDropedItemEvent(item) {
  // console.log(item);
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
  item.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('over');
    const dropCard = document.getElementById(e.dataTransfer.getData("text"))
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
  cardElement.setAttribute('id',card);
  cardElement.setAttribute('draggable', 'true');
  img.setAttribute('src', `/asset/image/poke/${card}.png`);
  cardElement.appendChild(img);
  cardElement.addEventListener('dragstart',dragCard);
  cardElement.addEventListener('dragend',dropCard);
  return cardElement
}
