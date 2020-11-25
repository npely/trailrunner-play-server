function initLevel(levelNumber) {
    window.location.href = `http://localhost:9000/level/${levelNumber}`;
    buildLevel();
}

function backToMain() {
    console.log("Hallo")
    window.location.href = "http://localhost:9000/menu";
}

function changeToLevelSelection() {
    window.location.href = "http://localhost:9000/level";
}

function loadLevel() {
    window.location.href = "http://localhost:9000/load";
}

function aboutGame() {
    window.location.href = "http://localhost:9000/about";
}

function moveUp() {
    let moveHttpRequest = new XMLHttpRequest();
    let changeHttpRequest = new XMLHttpRequest();

    changeHttpRequest.open('GET', '/changedFields/up', false);
    changeHttpRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            const changedFields = JSON.parse(changeHttpRequest.responseText)
            console.log(changedFields);
            let newPlayerFieldCol = document.getElementById("col-" + changedFields.newPlayerY + "," + changedFields.newPlayerX);
            if (changedFields.newPlayerFieldValue === -1) {
                window.location.href = "http://localhost:9000/lose";
            } else if (changedFields.newPlayerFieldValue === 9 || changedFields.newPlayerFieldValue === 19) {
                window.location.href = "http://localhost:9000/win";
            } else if (changedFields.newPlayerFieldValue === -100) {
              return null;
            } else {
                updateField(newPlayerFieldCol, changedFields.newPlayerFieldValue, changedFields.newPlayerY, changedFields.newPlayerX, true);
            }

            let oldPlayerFieldCol = document.getElementById("col-" + changedFields.PlayerY + "," + changedFields.PlayerX);
            updateField(oldPlayerFieldCol, changedFields.playerFieldValue, changedFields.playerY, changedFields.playerX, false);

            let doorFieldCol = document.getElementById("col-" + changedFields.doorY + "," + changedFields.doorX);
            if (changedFields.levelFieldSum === 0) {
                updateField(doorFieldCol, changedFields.doorValue * -1, changedFields.doorY, changedFields.doorX, false);
            } else {
                updateField(doorFieldCol, changedFields.doorValue, changedFields.doorY, changedFields.doorX, false);
            }
        }
        moveHttpRequest.open('GET', '/move/up', false);
        moveHttpRequest.send()
    }
    changeHttpRequest.send()
}

function moveDown() {
    let moveHttpRequest = new XMLHttpRequest();
    let changeHttpRequest = new XMLHttpRequest();

    changeHttpRequest.open('GET', '/changedFields/down', false);
    changeHttpRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            const changedFields = JSON.parse(changeHttpRequest.responseText)
            console.log(changedFields);
            let newPlayerFieldCol = document.getElementById("col-" + changedFields.newPlayerY + "," + changedFields.newPlayerX);
            if (changedFields.newPlayerFieldValue === -1) {
                window.location.href = "http://localhost:9000/lose";
            } else if (changedFields.newPlayerFieldValue === 9 || changedFields.newPlayerFieldValue === 19) {
                window.location.href = "http://localhost:9000/win";
            } else if (changedFields.newPlayerFieldValue === -100) {
                return null;
            } else {
                updateField(newPlayerFieldCol, changedFields.newPlayerFieldValue, changedFields.newPlayerY, changedFields.newPlayerX, true);
            }

            let oldPlayerFieldCol = document.getElementById("col-" + changedFields.PlayerY + "," + changedFields.PlayerX);
            updateField(oldPlayerFieldCol, changedFields.playerFieldValue, changedFields.playerY, changedFields.playerX, false);

            let doorFieldCol = document.getElementById("col-" + changedFields.doorY + "," + changedFields.doorX);
            if (changedFields.levelFieldSum === 0) {
                updateField(doorFieldCol, changedFields.doorValue * -1, changedFields.doorY, changedFields.doorX, false);
            } else {
                updateField(doorFieldCol, changedFields.doorValue, changedFields.doorY, changedFields.doorX, false);
            }
        }
        moveHttpRequest.open('GET', '/move/down', false);
        moveHttpRequest.send()
    }
    changeHttpRequest.send()
}

function moveLeft() {
    let moveHttpRequest = new XMLHttpRequest();
    let changeHttpRequest = new XMLHttpRequest();

    changeHttpRequest.open('GET', '/changedFields/left', false);
    changeHttpRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            const changedFields = JSON.parse(changeHttpRequest.responseText)
            console.log(changedFields);
            let newPlayerFieldCol = document.getElementById("col-" + changedFields.newPlayerY + "," + changedFields.newPlayerX);
            if (changedFields.newPlayerFieldValue === -1) {
                window.location.href = "http://localhost:9000/lose";
            } else if (changedFields.newPlayerFieldValue === 9 || changedFields.newPlayerFieldValue === 19) {
                window.location.href = "http://localhost:9000/win";
            } else if (changedFields.newPlayerFieldValue === -100) {
                return null;
            } else {
                updateField(newPlayerFieldCol, changedFields.newPlayerFieldValue, changedFields.newPlayerY, changedFields.newPlayerX, true);
            }

            let oldPlayerFieldCol = document.getElementById("col-" + changedFields.PlayerY + "," + changedFields.PlayerX);
            updateField(oldPlayerFieldCol, changedFields.playerFieldValue, changedFields.playerY, changedFields.playerX, false);

            let doorFieldCol = document.getElementById("col-" + changedFields.doorY + "," + changedFields.doorX);
            if (changedFields.levelFieldSum === 0) {
                updateField(doorFieldCol, changedFields.doorValue * -1, changedFields.doorY, changedFields.doorX, false);
            } else {
                updateField(doorFieldCol, changedFields.doorValue, changedFields.doorY, changedFields.doorX, false);
            }
        }
        moveHttpRequest.open('GET', '/move/left', false);
        moveHttpRequest.send()
    }
    changeHttpRequest.send()
}

function moveRight() {
    let moveHttpRequest = new XMLHttpRequest();
    let changeHttpRequest = new XMLHttpRequest();

    changeHttpRequest.open('GET', '/changedFields/right', false);
    changeHttpRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            const changedFields = JSON.parse(changeHttpRequest.responseText)
            console.log(changedFields);
            let newPlayerFieldCol = document.getElementById("col-" + changedFields.newPlayerY + "," + changedFields.newPlayerX);
            if (changedFields.newPlayerFieldValue === -1) {
                window.location.href = "http://localhost:9000/lose";
            } else if (changedFields.newPlayerFieldValue === 9 || changedFields.newPlayerFieldValue === 19) {
                window.location.href = "http://localhost:9000/win";
            } else if (changedFields.newPlayerFieldValue === -100) {
                return null;
            } else {
                updateField(newPlayerFieldCol, changedFields.newPlayerFieldValue, changedFields.newPlayerY, changedFields.newPlayerX, true);
            }

            let oldPlayerFieldCol = document.getElementById("col-" + changedFields.PlayerY + "," + changedFields.PlayerX);
            updateField(oldPlayerFieldCol, changedFields.playerFieldValue, changedFields.playerY, changedFields.playerX, false);

            let doorFieldCol = document.getElementById("col-" + changedFields.doorY + "," + changedFields.doorX);
            if (changedFields.levelFieldSum === 0) {
                updateField(doorFieldCol, changedFields.doorValue * -1, changedFields.doorY, changedFields.doorX, false);
            } else {
                updateField(doorFieldCol, changedFields.doorValue, changedFields.doorY, changedFields.doorX, false);
            }
        }
        moveHttpRequest.open('GET', '/move/right', false);
        moveHttpRequest.send()
    }
    changeHttpRequest.send()
}

function buildLevel() {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', "/levelMap", true);
    httpRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const mapData = JSON.parse(httpRequest.responseText)
            let parent = document.getElementById("level-map");
            for (let x = 0; x < 10; x++) {
                let row = document.createElement('div');
                row.classList.add('row');
                row.classList.add('justify-content-center');
                row.id = "row-" + x.toString();
                parent.append(row);
                for (let y = 0; y < 10; y++) {
                    let col = document.createElement('div');
                    col.classList.add('col');
                    col.classList.add('no-padding');
                    col.id = "col-" + x + "," + y;
                    row.append(col);
                    if (mapData.level.xPos === y && mapData.level.yPos === x) {
                        //create image
                        buildField(col, mapData.fieldvalues[x * 10 + y].fieldvalue, x, y, true);
                    } else {
                        //create image
                        buildField(col, mapData.fieldvalues[x * 10 + y].fieldvalue, x, y, false);
                    }
                }
            }
        }
    };
    httpRequest.send();
}

function updateField(parent, fieldValue, x, y, isPlayerOnField) {
    let image = document.getElementById("img-" + x + y);
    image.src = 'http://localhost:9000/assets/' + setFieldImage(parent, fieldValue, isPlayerOnField);
}

function buildField(parent, fieldValue, x, y, isPlayerOnField) {
    let image = document.createElement('img');
    //temporal work-around
    image.src = 'http://localhost:9000/assets/' + setFieldImage(parent, fieldValue, isPlayerOnField);
    image.classList.add("game-field");
    image.id = "img-" + x + y;
    parent.append(image);
}

function setFieldImage(parent, fieldValue, isPlayerOnField) {
    const path = "images/fields/";
    let myPicture = path;
    switch (fieldValue) {
        case -99:
            myPicture += "Wall.png";
            break;
        case -1:
            if (isPlayerOnField) {
                myPicture += "Ground_0.png";
                break;
            }
        case 0:
            if (isPlayerOnField) {
                myPicture += "Ground_0_P.png";
                break;
            } else {
                myPicture += "Ground_0.png";
                break;
            }
        case 1:
            if (isPlayerOnField) {
                myPicture += "Ground_1_P.png";
                break;
            } else {
                myPicture += "Ground_1.png";
                break;
            }
        case 2:
            if (isPlayerOnField) {
                myPicture += "Ground_2_P.png";
                break;
            } else {
                myPicture += "Ground_2.png";
                break;
            }
        case 3:
            if (isPlayerOnField) {
                myPicture += "Ground_3_P.png";
                break;
            } else {
                myPicture += "Ground_3.png";
                break;
            }
        case 4:
            if (isPlayerOnField) {
                myPicture += "Ground_4_P.png";
                break;
            } else {
                myPicture += "Ground_4.png";
                break;
            }
        case 5:
            if (isPlayerOnField) {
                myPicture += "Ground_5_P.png";
                break;
            } else {
                myPicture += "Ground_5.png";
                break;
            }
        case 10:
            myPicture += "Door4.png";
            break;
        case 20:
            myPicture += "Door24.png";
            break;
        case -10:
            myPicture += "Door1.png";
            break;
        case -20:
            myPicture += "Door21.png";
            break;
        default:
            myPicture += "Wall.png";
    }
    return myPicture;
}