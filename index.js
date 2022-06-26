function $(sele) {
    return document.querySelector(sele);
}

function $$(sele) {
    return document.querySelectorAll(sele);
}

var container = $('.container');

// 创建一个棋盘
var table = document.createElement('table');
table.classList.add('checkerboard');

// 棋子的颜色
var bg = 'white';

// 存储棋子
var chessArr = [];

// 判断游戏是否结束
var gameOver = false;

// 主函数入口
function main() {
    // 初始化
    initCheckerboard();

    // 绑定事件
    bindEvents();
}

main();

// 初始化棋盘
function initCheckerboard() {
    table.innerHTML = '';
    // 绘制一个 14 * 14 的棋盘
    for (let i = 0; i < 14; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < 14; j++) {
            var td = document.createElement('td');
            td.setAttribute('data-row', i);
            td.setAttribute('data-line', j);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

// 绑定事件
function bindEvents() {
    // 获取格子
    table.onclick = function (e) {
        // 获取到用户点击的 td 信息
        var temp = Object.assign({}, e.target.dataset);
        // console.log(temp);

        if (e.target.nodeName === 'TD' && !gameOver) {
            // 获取格子的宽度
            var chessW = table.offsetWidth / 14;

            // 判断用户点击的位置靠近那个角
            // 如果点击的位置大于格子宽度的一半，则在右边
            var positionL = e.offsetX > chessW / 2;
            // 如果点击的位置大于格子高度的一半，则在下边
            var positionR = e.offsetY > chessW / 2;
            var chessObj = {
                x: positionL ? parseInt(temp.line) + 1 : parseInt(temp.line),
                y: positionR ? parseInt(temp.row) + 1 : parseInt(temp.row),
                c: bg
            };
            // console.log(chessObj);
            // 绘制棋子
            createChess(chessObj);
            // 修改棋子的颜色
            bg = bg === 'white' ? 'black' : 'white';
        } else if (gameOver) {
            if (window.confirm('是否要再来一局？')) {
                // 棋子的颜色
                bg = 'white';

                // 存储棋子
                chessArr = [];

                // 判断游戏是否结束
                gameOver = false;

                initCheckerboard();
            }
        }
    }
}

// 绘制棋子
function createChess(chess) {
    // 判断点击的位置是否已经有个棋子
    if (chessArr[chess]) {
        return;
    }

    // 把棋子存入到数组中
    chessArr.push(chess);
    // 棋子就是一个 div
    var div = document.createElement('div');
    div.className = `chess ${chess.c}`;
    div.setAttribute('data-row', chess.y);
    div.setAttribute('data-line', chess.x);

    // 获取对应的格子，往里面放入棋子
    var td = $(`td[data-row='${chess.y}'][data-line='${chess.x}']`);

    // 判断棋子的位置是否在最右边
    if (chess.x === 14 && chess.y < 14) {
        div.style.left = '50%';
        td = $(`td[data-row='${chess.y}'][data-line='13']`);
    }

    // 判断棋子的位置是否在最右下边
    if (chess.x === 14 && chess.y === 14) {
        div.style.left = '50%';
        div.style.top = '50%';
        td = $(`td[data-row='13'][data-line='13']`);
    }

    // 判断棋子的位置是否在最下边
    if (chess.x < 14 && chess.y === 14) {
        div.style.top = '50%';
        td = $(`td[data-row='13'][data-line='${chess.x}']`);
    }

    td.appendChild(div);

    // 核对游戏是否结束
    chack();
}

// 检查游戏中是否已经可以分出胜负
function chack() {
    // 遍历存棋子的数组
    for (let i = 0; i < chessArr.length; i++) {
        // 获取当前的棋子
        var curChess = chessArr[i];

        var chack1, chack2, chack3, chack4;

        // 先判断横向是否有相同的 5 个
        chack1 = chessArr.find(function (item) {
            return item.x === curChess.x + 1 && item.y === curChess.y && item.c === curChess.c;
        });
        chack2 = chessArr.find(function (item) {
            return item.x === curChess.x + 2 && item.y === curChess.y && item.c === curChess.c;
        });
        chack3 = chessArr.find(function (item) {
            return item.x === curChess.x + 3 && item.y === curChess.y && item.c === curChess.c;
        });
        chack4 = chessArr.find(function (item) {
            return item.x === curChess.x + 4 && item.y === curChess.y && item.c === curChess.c;
        });
        if (chack1 && chack2 && chack3 && chack4) {
            end(curChess, chack1, chack2, chack3, chack4);
            return;
        }

        // 判断纵向是否有相同的 5 个
        chack1 = chessArr.find(function (item) {
            return item.x === curChess.x && item.y === curChess.y + 1 && item.c === curChess.c;
        });
        chack2 = chessArr.find(function (item) {
            return item.x === curChess.x && item.y === curChess.y + 2 && item.c === curChess.c;
        });
        chack3 = chessArr.find(function (item) {
            return item.x === curChess.x && item.y === curChess.y + 3 && item.c === curChess.c;
        });
        chack4 = chessArr.find(function (item) {
            return item.x === curChess.x && item.y === curChess.y + 4 && item.c === curChess.c;
        });
        if (chack1 && chack2 && chack3 && chack4) {
            end(curChess, chack1, chack2, chack3, chack4);
            return;
        }

        // 判断上斜左方向是否有相同的 5 个
        chack1 = chessArr.find(function (item) {
            return item.x === curChess.x - 1 && item.y === curChess.y - 1 && item.c === curChess.c;
        });
        chack2 = chessArr.find(function (item) {
            return item.x === curChess.x - 2 && item.y === curChess.y - 2 && item.c === curChess.c;
        });
        chack3 = chessArr.find(function (item) {
            return item.x === curChess.x - 3 && item.y === curChess.y - 3 && item.c === curChess.c;
        });
        chack4 = chessArr.find(function (item) {
            return item.x === curChess.x - 4 && item.y === curChess.y - 4 && item.c === curChess.c;
        });
        if (chack1 && chack2 && chack3 && chack4) {
            end(curChess, chack1, chack2, chack3, chack4);
            return;
        }

        // 判断上斜右方向是否有相同的 5 个
        chack1 = chessArr.find(function (item) {
            return item.x === curChess.x + 1 && item.y === curChess.y - 1 && item.c === curChess.c;
        });
        chack2 = chessArr.find(function (item) {
            return item.x === curChess.x + 2 && item.y === curChess.y - 2 && item.c === curChess.c;
        });
        chack3 = chessArr.find(function (item) {
            return item.x === curChess.x + 3 && item.y === curChess.y - 3 && item.c === curChess.c;
        });
        chack4 = chessArr.find(function (item) {
            return item.x === curChess.x + 4 && item.y === curChess.y - 4 && item.c === curChess.c;
        });
        if (chack1 && chack2 && chack3 && chack4) {
            end(curChess, chack1, chack2, chack3, chack4);
            return;
        }
    }
}

// 定义游戏结束函数
function end() {
    if (!gameOver) {
        gameOver = true;

        // 把串连的棋子显示出来
        for (let i = 0; i < arguments.length; i++) {
            var chess = $(`div[data-row='${arguments[i].y}'][data-line='${arguments[i].x}']`);
            chess.classList.add('win');
        }
        console.log(chessArr);
        // 把所有的棋子的标号显示出来
        for (let i = 0; i < chessArr.length; i++) {
            $(`div[data-row='${chessArr[i].y}'][data-line='${chessArr[i].x}']`).innerHTML = i + 1;
        }
    }
}