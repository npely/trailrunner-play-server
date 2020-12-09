let webSocket;
connectWebSocket()

function connectWebSocket() {
    webSocket = new WebSocket("ws://localhost:9000/websocket")
    console.info("Connecting to WebSocket")

    webSocket.onopen = function() {
        console.info("Connected to server: " + webSocket.url)
        webSocket.send("connect")
    }

    webSocket.onmessage = function(message) {
        webSocketOnMessage(message)
    }

    webSocket.onerror = function(event) {
        console.error(event)
    }

    webSocket.onclose = function() {
        console.info("Connection with Websocket closed")
    }
}

function webSocketOnMessage(message) {
    console.log("Im here")
    const { event, value } = JSON.parse(message.data)
    switch (event) {
        case "earthquake":
            console.log("EARTHQUAKE")
            console.log(value)
            levelAfterEarthquake(value)
            break;
        case "dungeon-changed":
            console.log("dungeon changed")
            console.log(value)
            break;
    }
}

function initLevel(levelNumber) {
    new Audio("http://localhost:9000/assets/audio/click.wav").play();
    window.location.href = `http://localhost:9000/level/${levelNumber}`;
    console.log("Test")
}

function backToMain() {
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

function load_sandbox() {
    window.location.href = "http://localhost:9000/sandbox";
}

function switchHardcoreMode() {
    $.ajax({
        method: 'GET',
        url: '/switchHardcoreMode',
        async: true,

        success: function(value) {
            let hardcoreButton = $("#hardcore-button")
            if (value.hardcoreMode) {
                hardcoreButton.text(String.fromCodePoint(parseInt("128128")))
            }
            else {
                hardcoreButton.text(String.fromCodePoint(parseInt("128124")))
            }
        }
    })
}

function levelAfterEarthquake(value) {
    let parent = $("#level-map");
    for (let x = 0; x < 10; x++) {
        let row = $(`<div class="row justify-content-center" id="row-${x.toString()}"></div>`);
        parent.append(row);
        for (let y = 0; y < 10; y++) {
            let col = $(`<div class="col no-padding" id="col-${x},${y}"></div>`);
            row.append(col);
            parent.html()
            let field = value.fields[x * 10 + y];
            let xy = x.toString() + y.toString()
            updateField(col, field.fieldvalue, field.fieldtype, xy, (value.level.PxPos === y && value.level.PyPos === x));
        }
    }
}

function moveUp() {
    moveUpdate('up')
}

function moveDown() {
    moveUpdate('down')
}

function moveLeft() {
    moveUpdate('left')
}

function moveRight() {
    moveUpdate('right')
}

function moveUpdate(direction) {
    let isSliding = false;
    $.ajax({
        method: 'GET',
        url: '/move/' + direction.toString(),
        dataType: 'json',
        async: false,

        success: function(value) {
            if (value.madeMove) {
                $.ajax({
                    method: 'GET',
                    url: '/changedFields/' + direction.toString(),
                    dataType: 'json',
                    async: false,

                    success: function(changedFields) {
                        isSliding = (changedFields.newPlayerField.fieldtype === "Ice");
                        console.log(changedFields);
                        let newPlayerFieldCol = $(`#col-${changedFields.newPlayerY},${changedFields.newPlayerX}`);
                        let oldPlayerFieldCol = $(`#col-${changedFields.PlayerY},${changedFields.PlayerX}`);
                        let doorFieldCol = $(`#col-${changedFields.doorY},${changedFields.doorX}`);
                        if (changedFields.newPlayerField.fieldvalue === -1) {
                            updateField(
                                oldPlayerFieldCol,
                                changedFields.playerField.fieldvalue,
                                changedFields.playerField.fieldtype,
                                changedFields.playerY.toString() + changedFields.playerX.toString(),
                                false);
                            updateField(
                                newPlayerFieldCol,
                                changedFields.newPlayerField.fieldvalue,
                                changedFields.newPlayerField.fieldtype,
                                changedFields.newPlayerY.toString() + changedFields.newPlayerX.toString(),
                                true);
                            setTimeout(function () {
                                window.location.href = "http://localhost:9000/lose";
                            }, 400);
                            return null;
                        } else if (changedFields.newPlayerField.fieldvalue === 9 || changedFields.newPlayerField.fieldvalue === 19) {
                            updateField(
                                oldPlayerFieldCol,
                                changedFields.playerField.fieldvalue,
                                changedFields.playerField.fieldtype,
                                changedFields.playerY.toString() + changedFields.playerX.toString(),
                                false);
                            updateField(
                                doorFieldCol,
                                changedFields.newPlayerField.fieldvalue,
                                "Door",
                                changedFields.doorY.toString() + changedFields.doorX.toString(),
                                true);
                            setTimeout(function () {
                                window.location.href = "http://localhost:9000/win";
                            }, 400);
                            return null;
                        } else if (changedFields.newPlayerField.fieldvalue === -100) {
                            return null;
                        } else {
                            updateField(newPlayerFieldCol,
                                changedFields.newPlayerField.fieldvalue,
                                changedFields.newPlayerField.fieldtype,
                                changedFields.newPlayerY.toString() + changedFields.newPlayerX.toString(),
                                true);
                        }

                        updateField(
                            oldPlayerFieldCol,
                            changedFields.playerField.fieldvalue,
                            changedFields.playerField.fieldtype,
                            changedFields.playerY.toString() + changedFields.playerX.toString(),
                            false);
                        if (changedFields.levelFieldSum === 0) {
                            updateField(
                                doorFieldCol,
                                changedFields.doorField.fieldvalue * (-1),
                                changedFields.doorField.fieldtype,
                                changedFields.doorY.toString() + changedFields.doorX.toString(),
                                false);
                        } else {
                            updateField(
                                doorFieldCol,
                                changedFields.doorField.fieldvalue,
                                changedFields.doorField.fieldtype,
                                changedFields.doorY.toString() + changedFields.doorX.toString(),
                                false);
                        }
                    }
                });
                if (isSliding) {
                    setTimeout(function () {
                        moveUpdate(direction);
                    }, 50);
                }
            }
        }
    });

}

function buildLevel() {
    $.ajax({
        method: 'GET',
        url: '/levelMap',
        dataType: 'json',

        success: function (mapData) {
            let parent = $("#level-map");
            for (let x = 0; x < 10; x++) {
                let row = $(`<div class="row justify-content-center" id="row-${x.toString()}"></div>`);
                parent.append(row);
                for (let y = 0; y < 10; y++) {
                    let col = $(`<div class="col no-padding" id="col-${x},${y}"></div>`);
                    row.append(col);
                    parent.html()
                    let field = mapData.fields[x * 10 + y];
                    let xy = x.toString() + y.toString()
                    buildField(col, field.fieldvalue, field.fieldtype, xy, (mapData.level.PxPos === y && mapData.level.PyPos === x));
                }
            }
        }
    })
}

function updateField(parent, fieldValue, fieldType, xy, isPlayerOnField) {
    let image = $(`#img-${xy}`);
    //temporal work-around
    image.attr('src', 'http://localhost:9000/assets/' + setFieldImage(parent, fieldValue, fieldType, isPlayerOnField));
}

function buildField(parent, fieldValue, fieldType, xy, isPlayerOnField) {
    //temporal work-around
    let src = 'http://localhost:9000/assets/' + setFieldImage(parent, fieldValue, fieldType, isPlayerOnField);
    let image = $(`<img class="game-field" id="img-${xy}" src=${src}>`);
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

function buildSandboxSelector() {

}

function buildSandboxMap() {
    let parent = document.getElementById("sandbox-map");
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
            let xy = x.toString() + y.toString()
            let imageHolder = document.createElement("div");
            imageHolder.id = "imgHolder-" + xy;
            let image = document.createElement('img');
            //temporal work-around
            image.src = 'http://localhost:9000/assets/images/fields/Wall.png';
            image.classList.add("game-field");
            image.id = "img-" + xy;
            image.addEventListener("drop", drop)
            image.addEventListener("dragover", allowDrop)
            imageHolder.append(image);
            parent.append(imageHolder);
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    console.log(ev);
    let data = ev.dataTransfer.getData("text");
    console.log(data)
    let target = ev.target;
    let parent = ev.target.parentNode;
    parent.removeChild(target)
    let image = document.createElement('img');
    //temporal work-around
    image.src = data;
    image.classList.add("game-field");
    image.addEventListener("drop", drop)
    image.addEventListener("dragover", allowDrop)
    parent.appendChild(image);
}