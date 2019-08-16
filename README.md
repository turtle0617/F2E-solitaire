# 新接龍
![](https://i.imgur.com/U5eehPU.png)

## 介紹
這是一個 高雄前端社群的精神時光屋屋挑戰賽，使用 原生 `JavaScript` 實作 **新接龍** 的練習，比較了使用`Drop`和`Drag`及使用`mosemove`和 `mouseup` 在卡牌的拖曳的差異。

[使用設計搞](http://thef2eweek2-sherry.surge.sh/) ： http://thef2eweek2-sherry.surge.sh/
## 使用說明
* 每局皆為亂數發牌，故有可能死局
* 左上四個空白區為暫存卡牌，一格只能放一張牌
![](https://i.imgur.com/P3KpuyJ.gif)
* 右上為計分區，每格需從該花色 ACE 一路疊放到 King
![](https://i.imgur.com/WZ36RE1.gif)
* 下面亂數卡牌列，可接受不同顏色卡牌遞減放置尾部
![](https://i.imgur.com/wo1KzTd.gif)
* 若計分區皆已放滿，遊戲結束，可在開啟新局

