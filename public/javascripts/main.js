function initLevel(levelNumber) {

}

function moveUp(x) {
    console.log("\nHallo, ich werde aufgerufen :)\n" + x.toString())
}

function moveDown() {
}

function moveLeft() {
}

function moveRight() {
}

function buildLevel() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', "/levelMap", true);
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const mapData = JSON.parse(httpRequest.responseText)
            var parent = document.getElementById("level-map");
            for (x = 0; x < 10; x++) {
                var row = document.createElement('div');
                row.classList.add('row');
                row.classList.add('justify-content-center');
                row.id = "row-" + x.toString();
                parent.append(row);
                for (y = 0; y < 10; y++) {
                    var col = document.createElement('div');
                    col.classList.add('col');
                    col.id = "no-padding";
                    row.append(col);
                    if (mapData.level.xPos == y && mapData.level.yPos == x) {
                        //create image
                        setFieldImage(col, mapData.fieldvalues[x * 10 + y].fieldvalue, true);
                    } else {
                        //create image
                        setFieldImage(col, mapData.fieldvalues[x * 10 + y].fieldvalue, false);
                    }
                }
            }
        }
    };
    httpRequest.send();
}

function buildField(parent, source) {
    var image = document.createElement('img');
    //temporal work-around
    image.src = 'http://localhost:9000/assets/' + source;
    image.id = "game-field";
    parent.append(image);
}


function setFieldImage(parent, fieldValue, isPlayerOnField) {
    console.log("\nHallo, ich werde aufgerufen :)\n")
    const path = "images/fields/";
    var myPicture = path;
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
        case -10:
            myPicture += "Door1.png";
            break;
        // } else {
        //     myPicture = path + "Door4.png";
        //     break;
        // }
        case -20:
            myPicture += "Door21.png";
            break;
        // } else {
        //     myPicture = path + "Door24.png";
        //     break;
        // }
        default:
            myPicture += "Wall.png";
    }
    buildField(parent, myPicture)
}