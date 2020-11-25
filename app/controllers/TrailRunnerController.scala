package controllers

import com.google.inject.Guice
import javax.inject._
import play.api.mvc._
import controller.controllerComponent.{ControllerInterface, DungeonChanged}
import aview.TUI
import model.levelComponent.levelBaseImpl.{Level1, Level2, Level3, Level4}
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

  def getChangedFields(move: String) = Action {
    var returnObject: JsObject = null;
    if (move == "up") {
      returnObject = Json.obj(
        "lose" -> gameController.levelLose(),
        "levelFieldSum" -> (gameController.level.sum() - 1),
        "doorX" -> gameController.level.doorX,
        "doorY" -> gameController.level.doorY,
        "doorValue" -> gameController.level.dungeon(gameController.level.doorY)(gameController.level.doorX).value,
        "playerY" -> gameController.player.yPos,
        "playerX" -> gameController.player.xPos,
        "playerFieldValue" -> gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).value,
        "newPlayerY" -> (gameController.player.yPos - 1),
        "newPlayerX" -> gameController.player.xPos,
        "newPlayerFieldValue" -> (gameController.level.dungeon(gameController.player.yPos - 1)(gameController.player.xPos).value - 1))
    }
    else if (move == "down") {
      returnObject = Json.obj(
        "levelFieldSum" -> (gameController.level.sum() - 1),
        "doorX" -> gameController.level.doorX,
        "doorY" -> gameController.level.doorY,
        "doorValue" -> gameController.level.dungeon(gameController.level.doorY)(gameController.level.doorX).value,
        "playerY" -> gameController.player.yPos,
        "playerX" -> gameController.player.xPos,
        "playerFieldValue" -> gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).value,
        "newPlayerY" -> (gameController.player.yPos + 1),
        "newPlayerX" -> gameController.player.xPos,
        "newPlayerFieldValue" -> (gameController.level.dungeon(gameController.player.yPos + 1)(gameController.player.xPos).value - 1))
    }
    else if (move == "left") {
      returnObject = Json.obj(
        "levelFieldSum" -> (gameController.level.sum() - 1),
        "doorX" -> gameController.level.doorX,
        "doorY" -> gameController.level.doorY,
        "doorValue" -> gameController.level.dungeon(gameController.level.doorY)(gameController.level.doorX).value,
        "playerY" -> gameController.player.yPos,
        "playerX" -> gameController.player.xPos,
        "playerFieldValue" -> gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).value,
        "newPlayerY" -> gameController.player.yPos,
        "newPlayerX" -> (gameController.player.xPos - 1),
        "newPlayerFieldValue" -> (gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos - 1).value - 1))
    }
    else {
      returnObject = Json.obj(
        "levelFieldSum" -> (gameController.level.sum() - 1),
        "doorX" -> gameController.level.doorX,
        "doorY" -> gameController.level.doorY,
        "doorValue" -> gameController.level.dungeon(gameController.level.doorY)(gameController.level.doorX).value,
        "playerY" -> gameController.player.yPos,
        "playerX" -> gameController.player.xPos,
        "playerFieldValue" -> gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).value,
        "newPlayerY" -> gameController.player.yPos,
        "newPlayerX" -> (gameController.player.xPos + 1),
        "newPlayerFieldValue" -> (gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos + 1).value - 1))
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
