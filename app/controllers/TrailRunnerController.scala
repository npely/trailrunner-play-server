package controllers

import com.google.inject.Guice
import javax.inject._
import play.api.mvc._
import controller.controllerComponent.{ControllerInterface, DungeonChanged}
import aview.TUI
import model.levelComponent.levelBaseImpl.{Level1, Level2, Level3, Level4, Level5}
import play.api.libs.json.{JsObject, Json}
import play.twirl.api.HtmlFormat
import src.main.TrailRunnerModule.TrailRunnerModule

@Singleton
class TrailRunnerController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  val injector = Guice.createInjector(new TrailRunnerModule)

  val gameController = injector.getInstance(classOf[ControllerInterface])
  val tui = new TUI(gameController)
  gameController.publish(new DungeonChanged)

  def about() = Action {
    Ok(getHtml(views.html.about()))
  }

  def sandbox() = Action {
    Ok(getHtml(views.html.sandbox(this)))
  }

  def save() = Action {
    gameController.save
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def load() = Action {
    gameController.load
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def changeToLevelSelection() = Action {
    gameController.changeToSelection()
    Ok(getHtml(views.html.levelSelection()))
  }

  def changeToGame(levelId: Long) = Action {
    if (levelId == 1) {
      gameController.initializeGame(new Level1, false)
    }
    else if (levelId == 2) {
      gameController.initializeGame(new Level2, false)
    }
    else if (levelId == 3) {
      gameController.initializeGame(new Level3, false)
    }
    else if (levelId == 4) {
      gameController.initializeGame(new Level4, false)
    }
    else if (levelId == 5) {
      gameController.initializeGame(new Level5, false)
    }
    else {
      BadRequest(tui.toString())
    }
    gameController.changeToGame()
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def moveUp() = Action {
    gameController.playerMoveUp()
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def moveDown() = Action {
    gameController.playerMoveDown()
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def moveLeft() = Action {
    gameController.playerMoveLeft()
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def moveRight() = Action {
    gameController.playerMoveRight()
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def undo() = Action {
    gameController.undo
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def redo() = Action {
    gameController.redo
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def start() = Action {
    Ok(getHtml(views.html.mainMenu()))
  }

  def menu() = Action {
    gameController.changeToMain()
    Ok(getHtml(views.html.mainMenu()))
  }

  def win() = Action {
    Ok(getHtml(views.html.winScreen()))
  }

  def lose() = Action {
    Ok(getHtml(views.html.loseScreen()))
  }

  def getMoveJson(yModifyer: Int, xModifyer: Int): JsObject = {
    Json.obj(
      "lose" -> gameController.levelLose(),
      "levelFieldSum" -> (gameController.level.sum() - 1),
      "doorX" -> gameController.level.doorX,
      "doorY" -> gameController.level.doorY,
      "doorField" -> Json.obj(
        "fieldvalue" -> gameController.level.dungeon(gameController.level.doorY)(gameController.level.doorX).value,
        "fieldtype" -> "Door"
      ),
      "playerY" -> gameController.player.yPos,
      "playerX" -> gameController.player.xPos,
      "playerField" -> Json.obj(
        "fieldvalue" -> gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).value,
        "fieldtype" -> gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).fieldType
      ),
      "newPlayerY" -> (gameController.player.yPos + yModifyer),
      "newPlayerX" -> (gameController.player.xPos + xModifyer),
      "newPlayerField" -> Json.obj(
        "fieldvalue" -> (gameController.level.dungeon(gameController.player.yPos + yModifyer)(gameController.player.xPos + xModifyer).value - 1),
        "fieldtype" -> gameController.level.dungeon(gameController.player.yPos + yModifyer)(gameController.player.xPos + xModifyer).fieldType
      ))
  }

  def getChangedFields(move: String) = Action {
    var returnObject: JsObject = null;
    if (move == "up") {
      returnObject = getMoveJson(-1 , 0)
    }
    else if (move == "down") {
      returnObject = getMoveJson(1 , 0)
    }
    else if (move == "left") {
      returnObject = getMoveJson(0 , -1)
    }
    else {
      returnObject = getMoveJson(0 , 1)
    }
    Ok(returnObject)
  }

  def getLevelMap() = Action {
    Ok(gameController.getLevelAsJson)
  }

  def getHtml(htmlFormat: HtmlFormat.Appendable): HtmlFormat.Appendable = {
    views.html.main(htmlFormat)
  }

  def isGameOver(): String = {
    if (gameController.levelWin()) {
      "win"
    }
    else if (gameController.levelLose()) {
      "lose"
    }
    else {
      "continue"
    }
  }

}
