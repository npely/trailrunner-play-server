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

  def load() = Action {
    gameController.load
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
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
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
  }

  def moveUp() = Action {
    gameController.playerMoveUp()
    evaluateMove()
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
  }

  def moveDown() = Action {
    gameController.playerMoveDown()
    evaluateMove()
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
  }

  def moveLeft() = Action {
    gameController.playerMoveLeft()
    evaluateMove()
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
  }

  def moveRight() = Action {
    gameController.playerMoveRight()
    evaluateMove()
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
  }

  def undo() = Action {
    gameController.undo
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
  }

  def redo() = Action {
    gameController.redo
    Ok(getHtml(views.html.trailrunner(gameController.levelToString)))
  }

  def start() = Action {
    Ok(getHtml(views.html.mainMenu()))
  }

  def menu() = Action {
    gameController.changeToMain()
    Ok(getHtml(views.html.mainMenu()))
  }

  def getHtml(htmlFormat: HtmlFormat.Appendable): HtmlFormat.Appendable = {
    views.html.main("TrailRunner")(htmlFormat)
  }

  def evaluateMove(): Unit = {
    if (!gameController.levelLose()) {
      if (gameController.levelWin()) {
        gameController.changeToMain()
      }
    }
    else {
      gameController.changeToMain()
    }
  }
}
