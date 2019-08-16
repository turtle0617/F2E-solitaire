main(52);

function main(cardNum) {
  const randomCardMap = setCardNumber(cardNum);
  const cargGroup = sliceCardToGroup(randomCardMap, 4, 7);
  const randomCardContainer = [
    ...document.querySelectorAll(".randomCards__column")
  ];
  randomCardContainer.forEach((column, index) => {
    cargGroup[index].forEach(card =>
      column.appendChild(generateCardElement(card))
    );
  });
}

function coutElementDrop(putCardBox, region, originalCardColumn) {
  const countStorages = [...document.querySelectorAll(".countStorages__item")];
  if (putCardBox.childElementCount > 1) {
    resetCardToOriginalRegion(
      originalCardColumn,
      [...putCardBox.children],
      region
    );
    return;
  }
  const card = putCardBox.firstChild;
  const hasCard = region.htmlNode.children.length;
  if (hasCard) {
    const isSameSuit = checkCardSuit(card, region.htmlNode.children[0]);
    const order = checkCardOrder(card, region.htmlNode.lastChild, "increment");
    if (!isSameSuit || !order) {
      resetCardToOriginalRegion(originalCardColumn, card, region);
      return;
    }
  } else {
    const isAce = getCardNumber(card) === 1;
    if (!isAce) {
      resetCardToOriginalRegion(originalCardColumn, card, region);
      return;
    }
  }
  region.htmlNode.appendChild(card);
  clearCardStyle(card);
  region.htmlNode.classList.remove("over");
  if (clearGame(countStorages)) {
    resetGame();
  }
}

function temporaryElementDrop(putCardBox, region, originalCardColumn) {
  if (putCardBox.childElementCount > 1) {
    resetCardToOriginalRegion(
      originalCardColumn,
      [...putCardBox.children],
      region
    );
    return;
  }
  const hasCard = region.htmlNode.children.length;
  const card = putCardBox.firstChild;
  if (hasCard || putCardBox.childElementCount > 1) {
    resetCardToOriginalRegion(originalCardColumn, card, region);
    return;
  }
  region.htmlNode.appendChild(card);
  clearCardStyle(card);
  region.htmlNode.classList.remove("over");
}

function columnByRandomElementDrop(putCardBox, region, originalCardColumn) {
  const cardGroup = [...putCardBox.children];
  const meetRule = compareCardMeetsTheRule(
    region.htmlNode.lastChild,
    cardGroup[0]
  );
  if (!meetRule) {
    cardGroup.forEach(card => {
      resetCardToOriginalRegion(originalCardColumn, card, region);
    });
    return;
  }
  cardGroup.forEach(card => {
    region.htmlNode.appendChild(card);
    clearCardStyle(card);
  });
  region.htmlNode.classList.remove("over");
}

function resetCardToOriginalRegion(originalCardColumn, card, region) {
  if (Array.isArray(card)) {
    card.forEach(item => {
      originalCardColumn.appendChild(item);
      clearCardStyle(item);
    });
  } else {
    originalCardColumn.appendChild(card);
    clearCardStyle(card);
  }
  if (region) region.htmlNode.classList.remove("over");
  return;
}

function setCardNumber(cardNum) {
  return Array(cardNum)
    .fill(1)
    .map((item, index) => {
      index += 1;
      if (index <= 13) return `黑桃${index}`;
      else if (index > 13 && index <= 26) return `愛心${index - 13}`;
      else if (index > 26 && index <= 39) return `方塊${index - 26}`;
      else if (index > 39) return `梅花${index - 39}`;
    })
    .sort((a, b) => Math.random() - 0.5);
}

function sliceCardToGroup(cards, groups, position) {
  return Array(groups)
    .fill(1)
    .map((group, index) => {
      group = cards.slice(index * 13, (index + 1) * 13);
      return [group.slice(0, position), group.slice(position)];
    })
    .flat()
    .sort((a, b) => b.length - a.length);
}

function generateCardElement(card) {
  const cardElement = document.createElement("div");
  const img = document.createElement("img");
  cardElement.setAttribute("class", "card");
  cardElement.setAttribute("id", card);
  cardElement.setAttribute("draggable", "true");
  img.setAttribute("src", `asset/image/poke/${card}.png`);
  img.addEventListener("dragstart", e => {
    e.preventDefault();
  });
  cardElement.appendChild(img);
  cardElement.addEventListener("mousedown", clickCard);

  return cardElement;
}

function clickCard(e) {
  const cardColumn = this.parentNode;
  const allCardsInColumn = [...cardColumn.children];
  const isLastCard = cardColumn.lastChild === this;
  const isOrder = checkCardOrderUntilEnd(this, allCardsInColumn);
  if (!isLastCard && !isOrder) return;
  const currentCardUntilEndGroup = getCurrentCardUntilEnd(
    allCardsInColumn,
    this
  );
  const dropRegions = getDropRegion();
  const dropRegionsDetail = getDragPositionInScreen(dropRegions);
  moveCard(e, currentCardUntilEndGroup, dropRegionsDetail);
}

function moveCard(event, cardGroup, dropRegions) {
  let putCardBoxPosition = cardGroup[0].getBoundingClientRect();
  let originalCardColumn = cardGroup[0].parentNode;
  let shiftX = event.clientX - putCardBoxPosition.left;
  let shiftY = event.clientY - putCardBoxPosition.top;
  let putCardBox = generateCardBox(cardGroup);
  document.body.append(putCardBox);
  moveAt(event.pageX, event.pageY);
  document.addEventListener("mousemove", onMouseMove);

  putCardBox.addEventListener("mouseup", mouseUp, {
    once: true
  });

  function moveAt(pageX, pageY) {
    putCardBox.style.left = pageX - shiftX + "px";
    putCardBox.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    dropRegions.forEach(region => {
      const isMatch = checkIsInDropRegion(putCardBox, region);
      if (isMatch) {
        region.htmlNode.classList.add("over");
        return;
      }
      region.htmlNode.classList.remove("over");
    });
  }
  function mouseUp(event) {
    document.removeEventListener("mousemove", onMouseMove);
    const matchRegion = dropRegions.filter(region =>
      checkIsInDropRegion(putCardBox, region)
    )[0];
    if (!matchRegion) {
      resetCardToOriginalRegion(originalCardColumn, [...putCardBox.children]);
      putCardBox.remove();
      return;
    }
    cardDrop(putCardBox, matchRegion, originalCardColumn);
    putCardBox.remove();
  }
}

function cardDrop(putCardBox, matchRegion, originalCardColumn) {
  switch (matchRegion.name) {
    case "count":
      coutElementDrop(putCardBox, matchRegion, originalCardColumn);
      break;
    case "temporary":
      temporaryElementDrop(putCardBox, matchRegion, originalCardColumn);
      break;
    case "random":
      columnByRandomElementDrop(putCardBox, matchRegion, originalCardColumn);
      break;
    default:
      alert("偵測區域錯誤");
      break;
  }
}

function generateCardBox(cardGroup) {
  const cardBox = document.createElement("div");
  cardBox.setAttribute("class", "putCardBox");
  cardBox.style.position = "absolute";
  cardBox.style.zIndex = 1000;
  cardGroup.forEach(card => {
    cardBox.appendChild(card);
  });
  return cardBox;
}

function checkCardSuit(droppedCard, bottomCard) {
  const suit = getCardSuit(bottomCard);
  const droppedCard_suit = getCardSuit(droppedCard);
  return suit === droppedCard_suit;
}

function checkCardOrder(droppedCard, previousCard, status) {
  status = status === "increment" ? 1 : -1;
  const previousCard_num = getCardNumber(previousCard);
  const droppedCard_num = getCardNumber(droppedCard);
  return droppedCard_num - previousCard_num === status;
}

function checkCardOrderUntilEnd(currentCard, allCards) {
  const currentCardUntilEndGroup = getCurrentCardUntilEnd(
    allCards,
    currentCard
  );
  return currentCardUntilEndGroup.every((card, index, cardGroup) => {
    const isLast = index === cardGroup.length - 1;
    if (isLast) return true;
    return compareCardMeetsTheRule(card, cardGroup[index + 1]);
  });
}

function compareCardMeetsTheRule(currentCard, nextCard) {
  if (!currentCard || !nextCard) return true;
  const currentSuit = converCardSuitToColor(currentCard);
  const nextSuit = converCardSuitToColor(nextCard);
  const currentNum = getCardNumber(currentCard);
  const nextNum = getCardNumber(nextCard);
  return currentSuit !== nextSuit && currentNum - nextNum === 1;
}

function converCardSuitToColor(card) {
  const suit = getCardSuit(card);
  return suit === "愛心" || suit === "方塊" ? "red" : "black";
}

function getCardSuit(card) {
  return card.getAttribute("id").replace(/(\d+)/, "");
}

function getCardNumber(card) {
  return parseInt(card.getAttribute("id").replace(/^(\D+)/, ""));
}

function getCardId(card) {
  return card.getAttribute("id");
}

function getCurrentCardUntilEnd(cardGroup, currentCard) {
  const currentCardIndex = cardGroup.findIndex(card => card === currentCard);
  return cardGroup.filter((card, index) => index >= currentCardIndex);
}

function getDragPositionInScreen(dragAreas) {
  return dragAreas.map(area => {
    const name = area
      .getAttribute("class")
      .split(" ")[1]
      .replace(/([A-Z])(\w+)/, "");
    const position = area.getBoundingClientRect();
    return {
      name: name,
      htmlNode: area,
      top: position.top,
      bottom: position.bottom,
      left: position.left,
      right: position.right,
      width: position.width,
      height: position.height
    };
  });
}

function checkIsInDropRegion(card, dropRegion) {
  let cardPosition = card.getBoundingClientRect();
  return (
    cardWidthHalfInDropRegion(cardPosition, dropRegion) &&
    cardLongHalfInDropRegion(cardPosition, dropRegion)
  );
}

function cardWidthHalfInDropRegion(cardPosition, dropRegion) {
  const cardWidthInRegion =
    cardPosition.left < dropRegion.left
      ? cardPosition.right - dropRegion.left
      : dropRegion.right - cardPosition.left;
  if (cardWidthInRegion < 0) return false;
  return cardWidthInRegion / dropRegion.width > 0.5;
}

function cardLongHalfInDropRegion(cardPosition, dropRegion) {
  if (
    cardPosition.top > dropRegion.bottom ||
    cardPosition.bottom < dropRegion.top
  )
    return false;
  const cardLongInRegion =
    cardPosition.top < dropRegion.top
      ? cardPosition.bottom - dropRegion.top
      : dropRegion.bottom - cardPosition.top;
  return cardLongInRegion / cardPosition.height > 0.5;
}

function clearCardStyle(card) {
  card.style.position = "";
  card.style.left = "";
  card.style.top = "";
  card.style.zIndex = "";
}

function clearGame(countStorages) {
  return countStorages.every(countStorage => {
    const cards = [...countStorage.children];
    const [cardsNum, cardsSuit] = cards.map(card => [
      getCardNumber(card),
      getCardSuit(card)
    ]);
    const isAllSameSuit = new Set(cardsSuit).size === 1;
    const isOrder = cardsNum.every((cardNum, index) => cardNum === index + 1);
    return isAllSameSuit && isOrder;
  });
}

function resetGame() {
  const hideScreen = document.createElement("div");
  const resetGame = document.createElement("div");
  const resetGame__title = document.createElement("div");
  const resresetGame__select = document.createElement("div");
  hideScreen.setAttribute("class", "hideScreen");
  resetGame.setAttribute("class", "resetGame");
  resetGame__title.setAttribute("class", "resetGame__title");
  resresetGame__select.setAttribute("class", "resetGame__select");
  resetGame__title.innerText = "New Game";
  resresetGame__select.innerText = "Restart Game";
  resresetGame__select.addEventListener(
    "click",
    function() {
      clearRandomCardColumn();
      main(52);
      hideScreen.remove();
    },
    {
      once: true
    }
  );
  resetGame.appendChild(resetGame__title);
  resetGame.appendChild(resresetGame__select);
  hideScreen.appendChild(resetGame);
  document.body.appendChild(hideScreen);
}

function clearRandomCardColumn() {
  const dropRegions = getDropRegion();
  dropRegions.forEach(region => {
    while (region.lastChild) {
      region.removeChild(region.lastChild);
    }
  });
}

function getDropRegion() {
  const countStorages = [...document.querySelectorAll(".countStorages__item")];
  const temporaryStorages = [
    ...document.querySelectorAll(".temporaryStorages__item")
  ];
  const randomCardContainer = [
    ...document.querySelectorAll(".randomCards__column")
  ];
  const dropRegions = [
    ...temporaryStorages,
    ...countStorages,
    ...randomCardContainer
  ];
  return dropRegions;
}
