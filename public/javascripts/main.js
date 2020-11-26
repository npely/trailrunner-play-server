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

function moveUpdate(direction) {
    let isSliding = false;
    let changeHttpRequest = new XMLHttpRequest();
    changeHttpRequest.open('GET', ('/changedFields/' + direction.toString()), false);
    changeHttpRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const changedFields = JSON.parse(changeHttpRequest.responseText)
            isSliding = (changedFields.newPlayerField.fieldtype === "Ice");
            console.log(changedFields);
            let newPlayerFieldCol = document.getElementById("col-" + changedFields.newPlayerY + "," + changedFields.newPlayerX);
            let oldPlayerFieldCol = document.getElementById("col-" + changedFields.PlayerY + "," + changedFields.PlayerX);
            let doorFieldCol = document.getElementById("col-" + changedFields.doorY + "," + changedFields.doorX);
            if (changedFields.newPlayerField.fieldvalue === -1) {
                updateField(oldPlayerFieldCol, changedFields.playerField.fieldvalue, changedFields.playerField.fieldtype, changedFields.playerY.toString() + changedFields.playerX.toString(), false);
                updateField(newPlayerFieldCol, changedFields.newPlayerField.fieldvalue, changedFields.newPlayerField.fieldtype, changedFields.newPlayerY.toString() + changedFields.newPlayerX.toString(), true);
                setTimeout(function () {
                    window.location.href = "http://localhost:9000/lose";
                }, 400);
                return null;
            } else if (changedFields.newPlayerField.fieldvalue === 9 || changedFields.newPlayerField.fieldvalue === 19) {
                updateField(oldPlayerFieldCol, changedFields.playerField.fieldvalue, changedFields.playerField.fieldtype, changedFields.playerY.toString() + changedFields.playerX.toString(), false);
                updateField(doorFieldCol, changedFields.newPlayerField.fieldvalue, "Door", changedFields.doorY.toString() + changedFields.doorX.toString(), true);
                setTimeout(function () {
                    window.location.href = "http://localhost:9000/win";
                }, 400);
                return null;
            } else if (changedFields.newPlayerField.fieldvalue === -100) {
                return null;
            } else {

                updateField(newPlayerFieldCol, changedFields.newPlayerField.fieldvalue, changedFields.newPlayerField.fieldtype, changedFields.newPlayerY.toString() + changedFields.newPlayerX.toString(), true);
            }

            updateField(oldPlayerFieldCol, changedFields.playerField.fieldvalue, changedFields.playerField.fieldtype, changedFields.playerY.toString() + changedFields.playerX.toString(), false);
            if (changedFields.levelFieldSum === 0) {
                updateField(doorFieldCol, changedFields.doorField.fieldvalue * (-1), changedFields.doorField.fieldtype, changedFields.doorY.toString() + changedFields.doorX.toString(), false);
            } else {
                updateField(doorFieldCol, changedFields.doorField.fieldvalue, changedFields.doorField.fieldtype, changedFields.doorY.toString() + changedFields.doorX.toString(), false);
            }
            let moveHttpRequest = new XMLHttpRequest();
            moveHttpRequest.open('GET', ('/move/' + direction.toString()), false);
            moveHttpRequest.send();
        }
    }
    changeHttpRequest.send();
    if (isSliding) {
        setTimeout(function () {
            moveUpdate(direction);
        }, 50);
    }
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
                    let field = mapData.fieldvalues[x * 10 + y];
                    let xy = x.toString() + y.toString()
                    buildField(col, field.fieldvalue, field.fieldtype, xy, (mapData.level.xPos === y && mapData.level.yPos === x));
                }
            }
        }
    };
    httpRequest.send();
}

function updateField(parent, fieldValue, fieldType, xy, isPlayerOnField) {
    let image = document.getElementById("img-" + xy);
    //temporal work-around
    image.src = 'http://localhost:9000/assets/' + setFieldImage(parent, fieldValue, fieldType, isPlayerOnField);
}

function buildField(parent, fieldValue, fieldType, xy, isPlayerOnField) {
    let image = document.createElement('img');
    //temporal work-around
    image.src = 'http://localhost:9000/assets/' + setFieldImage(parent, fieldValue, fieldType, isPlayerOnField);
    image.classList.add("game-field");
    image.id = "img-" + xy;
    parent.append(image);
}

function setFieldImage(parent, fieldValue, fieldType, isPlayerOnField) {
    let myPicture = "images/fields/";
    if (fieldValue >= -20 && fieldValue <= 20) {
        if (fieldType === "Door" || !isPlayerOnField) {
            myPicture += fieldType + "_" + fieldValue + ".png";
        } else {
            myPicture += fieldType + "_" + fieldValue + "_P.png";
        }
    } else {
        myPicture += "Wall.png";
    }
    return myPicture;
}