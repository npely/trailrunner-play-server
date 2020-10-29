package controllers

import com.google.inject.Guice
import javax.inject._
import play.api._
import play.api.mvc._
import controller.controllerComponent.{ControllerInterface, DungeonChanged}
import aview.TUI
import main.TrailRunnerModule
import model.levelComponent.levelBaseImpl.{Level1, Level2, Level3, Level4}

@Singleton
class TrailRunnerController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  val injector = Guice.createInjector(new TrailRunnerModule)

  val gameController = injector.getInstance(classOf[ControllerInterface])
  val tui = new TUI(gameController)
  gameController.publish(new DungeonChanged)

  def changeToLevelSelection() = Action {
    gameController.changeToSelection()
    Ok(tui.toString())
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
    Ok(tui.toString())
  }

  def moveUp() = Action {
    gameController.playerMoveUp()
    tui.evaluateMove()
    Ok(tui.toString())
  }

  def moveDown() = Action {
    gameController.playerMoveDown()
    tui.evaluateMove()
    Ok(tui.toString())
  }

  def moveLeft() = Action {
    gameController.playerMoveLeft()
    tui.evaluateMove()
    Ok(tui.toString())
  }

  def moveRight() = Action {
    gameController.playerMoveRight()
    tui.evaluateMove()
    Ok(tui.toString())
  }

  def undo() = Action {
    gameController.undo
    Ok(tui.toString())
  }

  def redo() = Action {
    gameController.redo
    Ok(tui.toString())
  }

  def start() = Action {
    Ok(tui.toString())
  }

  def menu() = Action {
    gameController.changeToMain()
    Ok(tui.toString())
  }
}
