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

function buildLevel(dungeon) {
    console.log("Hallo")
    console.log("Hallo" + dungeon(0)(0).value)
}

function setFieldImage(fieldValue, isPlayerOnField) {
    console.log("\nHallo, ich werde aufgerufen :)\n")
    var myPicture;
    const path = "images/fields/";
    switch (fieldValue) {
        case -99:
            myPicture = path + "Wall.png";
            break;
        case -1:
            if (isPlayerOnField) {
                myPicture = path + "Ground_0.png";
                break;
            }
        case 0:
            if (isPlayerOnField) {
                myPicture = path + "Ground_0_P.png";
                break;
            } else {
                myPicture = path + "Ground_0.png";
                break;
            }
        case 1:
            if (isPlayerOnField) {
                myPicture = path + "Ground_1_P.png";
                break;
            } else {
                myPicture = path + "Ground_1.png";
                break;
            }
        case 2:
            if (isPlayerOnField) {
                myPicture = path + "Ground_2_P.png";
                break;
            } else {
                myPicture = path + "Ground_2.png";
                break;
            }
        case 3:
            if (isPlayerOnField) {
                myPicture = path + "Ground_3_P.png";
                break;
            } else {
                myPicture = path + "Ground_3.png";
                break;
            }
        case 4:
            if (isPlayerOnField) {
                myPicture = path + "Ground_4_P.png";
                break;
            } else {
                myPicture = path + "Ground_4.png";
                break;
            }
        case 5:
            if (isPlayerOnField) {
                myPicture = path + "Ground_5_P.png";
                break;
            } else {
                myPicture = path + "Ground_5.png";
                break;
            }
        case -10:
            myPicture = path + "Door1.png";
            break;
        // } else {
        //     myPicture = path + "Door4.png";
        //     break;
        // }
        case -20:
            myPicture = path + "Door21.png";
            break;
        // } else {
        //     myPicture = path + "Door24.png";
        //     break;
        // }
        default:
            myPicture = path + "Wall.png";
    }

    const image = document.getElementById("game-field");
    image.src = myPicture;
}