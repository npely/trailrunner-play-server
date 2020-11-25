package controllers

import com.google.inject.Guice
import javax.inject._
import play.api.mvc._
import controller.controllerComponent.{ControllerInterface, DungeonChanged}
import aview.TUI
import main.TrailRunnerModule
import model.levelComponent.levelBaseImpl.{Level1, Level2, Level3, Level4}
import play.twirl.api.HtmlFormat

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
    if(levelId == 1) {
      gameController.initializeGame(new Level1, false)
    }
    else if(levelId == 2) {
      gameController.initializeGame(new Level2, false)
    }
    else if(levelId == 3) {
      gameController.initializeGame(new Level3, false)
    }
    else if(levelId == 4) {
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
    if (isGameOver() == "win") {
      Ok(getHtml(views.html.winScreen()))
    } else if (isGameOver() == "lose") {
      Ok(getHtml(views.html.loseScreen()))
    } else {
      Ok(getHtml(views.html.trailrunner(this)))
    }
  }

  def moveDown() = Action {
    gameController.playerMoveDown()
    if (isGameOver() == "win") {
      Ok(getHtml(views.html.winScreen()))
    } else if (isGameOver() == "lose") {
      Ok(getHtml(views.html.loseScreen()))
    } else {
      Ok(getHtml(views.html.trailrunner(this)))
    }
  }

  def moveLeft() = Action {
    gameController.playerMoveLeft()
    if (isGameOver() == "win") {
      Ok(getHtml(views.html.winScreen()))
    } else if (isGameOver() == "lose") {
      Ok(getHtml(views.html.loseScreen()))
    } else {
      Ok(getHtml(views.html.trailrunner(this)))
    }
  }

  def moveRight() = Action {
    gameController.playerMoveRight()
    if (isGameOver() == "win") {
      Ok(getHtml(views.html.winScreen()))
    } else if (isGameOver() == "lose") {
      Ok(getHtml(views.html.loseScreen()))
    } else {
      Ok(getHtml(views.html.trailrunner(this)))
    }
  }

  def undo() = Action {
    gameController.undo
    if (isGameOver() == "win") {
      Ok(getHtml(views.html.winScreen()))
    } else if (isGameOver() == "lose") {
      Ok(getHtml(views.html.loseScreen()))
    } else {
      Ok(getHtml(views.html.trailrunner(this)))
    }
  }

  def redo() = Action {
    gameController.redo
    if (isGameOver() == "win") {
      Ok(getHtml(views.html.winScreen()))
    } else if (isGameOver() == "lose") {
      Ok(getHtml(views.html.loseScreen()))
    } else {
      Ok(getHtml(views.html.trailrunner(this)))
    }
  }

  def start() = Action {
    Ok(getHtml(views.html.mainMenu()))
  }

  def menu() = Action {
    gameController.changeToMain()
    Ok(getHtml(views.html.mainMenu()))
  }

  def getLevelMap() = Action {
    Ok(gameController.getLevelAsJson())
  }

  def getHtml(htmlFormat: HtmlFormat.Appendable): HtmlFormat.Appendable = {
    views.html.main("TrailRunner")(htmlFormat)
  }

  def isGameOver(): String = {
    if(gameController.levelWin()) {
      "win"
    }
    else if(gameController.levelLose()) {
      "lose"
    }
    else {
      "continue"
    }
  }
}
