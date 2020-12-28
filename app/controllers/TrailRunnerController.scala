package controllers

import com.google.inject.Guice
import javax.inject._
import play.api.mvc._
import controller.controllerComponent.{ControllerInterface, DungeonChanged, Earthquake}
import aview.TUI
import model.levelComponent.levelBaseImpl.{Level1, Level2, Level3, Level4, Level5}
import play.api.libs.json.{JsObject, JsValue, Json}
import play.twirl.api.HtmlFormat
import play.api.libs.streams.ActorFlow
import akka.actor._
import akka.stream.Materializer
import main.TrailRunnerModule

import scala.swing.Reactor

@Singleton
class TrailRunnerController @Inject()(val controllerComponents: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends BaseController {
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
    gameController.load(gameController.getLevelAsJson.toString(), true)
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
    gameController.changeToGame()
    Ok(getHtml(views.html.trailrunner(this)))
  }

  def moveUp() = Action {
    val madeMove: Boolean = gameController.playerMoveUp()
    Ok(Json.obj(
      "madeMove" -> madeMove
    ))
  }

  def moveDown() = Action {
    val madeMove: Boolean = gameController.playerMoveDown()
    Ok(Json.obj(
      "madeMove" -> madeMove
    ))
  }

  def moveLeft() = Action {
    val madeMove: Boolean = gameController.playerMoveLeft()
    Ok(Json.obj(
      "madeMove" -> madeMove
    ))
  }

  def moveRight() = Action {
    val madeMove: Boolean = gameController.playerMoveRight()
    Ok(Json.obj(
      "madeMove" -> madeMove
    ))
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

  def switchHardcoreMode() = Action {
    gameController.setHardcoreMode(!gameController.getHardcoreMode())
    Ok(Json.obj("hardcoreMode" -> gameController.getHardcoreMode()))
  }

  def win() = Action {
    Ok(getHtml(views.html.winScreen()))
  }

  def lose() = Action {
    Ok(getHtml(views.html.loseScreen()))
  }

  def getMoveJson(yModifier: Int, xModifier: Int): JsObject = {
    var isSliding = gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).fieldType == "Ice" &&
      gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).value >= 0 &&
      gameController.level.dungeon(gameController.player.yPos - yModifier)(gameController.player.xPos - xModifier).fieldType != "Wall"

    Json.obj(
      "lose" -> gameController.levelLose(),
      "levelFieldSum" -> gameController.level.sum(),
      "doorX" -> gameController.level.doorX,
      "doorY" -> gameController.level.doorY,
      "doorField" -> Json.obj(
        "fieldvalue" -> gameController.level.dungeon(gameController.level.doorY)(gameController.level.doorX).value,
        "fieldtype" -> "Door"
      ),
      "playerY" -> (gameController.player.yPos + yModifier),
      "playerX" -> (gameController.player.xPos + xModifier),
      "playerField" -> Json.obj(
        "fieldvalue" -> gameController.level.dungeon(gameController.player.yPos + yModifier)(gameController.player.xPos + xModifier).value,
        "fieldtype" -> gameController.level.dungeon(gameController.player.yPos + yModifier)(gameController.player.xPos + xModifier).fieldType
      ),
      "newPlayerY" -> gameController.player.yPos,
      "newPlayerX" -> gameController.player.xPos,
      "newPlayerField" -> Json.obj(
        "fieldvalue" -> (gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).value),
        "fieldtype" -> gameController.level.dungeon(gameController.player.yPos)(gameController.player.xPos).fieldType
      ),
      "isSliding" -> isSliding)
  }

  def getChangedFields(move: String) = Action {
    var returnObject: JsObject = null;
    if (move == "up") {
      returnObject = getMoveJson(1 , 0)
    }
    else if (move == "down") {
      returnObject = getMoveJson(-1 , 0)
    }
    else if (move == "left") {
      returnObject = getMoveJson(0 , 1)
    }
    else {
      returnObject = getMoveJson(0 , -1)
    }
    Ok(returnObject)
  }

  def getLevelMap() = Action {
    Ok(gameController.getLevelAsJson)
  }


  def loadCustomGame(json: String): Unit = {
    gameController.load(json, false)
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

  def socket = WebSocket.accept[JsValue, JsValue] { _ =>
    ActorFlow.actorRef {
      actorRef => Props(new TrailRunnerWebSocketActor(actorRef))
    }
  }

  class TrailRunnerWebSocketActor(out: ActorRef) extends Actor with Reactor {
    listenTo(gameController)

    reactions += {
      case event: Earthquake =>
        gameController.earthquake()
        out ! buildJsObject("earthquake", gameController.getLevelAsJson)
      case event: DungeonChanged =>
        out ! buildJsObject("dungeon-changed", gameController.getLevelAsJson)
    }

    def buildJsObject(event: String, value: JsValue): String = {
      Json.obj("event" -> event, "value" -> value).toString()
    }

    def receive = {
      case "ping" => out ! Json.obj("alive" -> "pong")
    }
  }
}
