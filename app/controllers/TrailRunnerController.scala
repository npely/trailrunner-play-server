package controllers

import com.google.inject.Guice
import javax.inject._
import play.api._
import play.api.mvc._
import controller.controllerComponent.{ControllerInterface, DungeonChanged}
import aview.TUI
import main.TrailRunnerModule

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

  def changeToGame() = Action {
    gameController.changeToGame()
    Ok(tui.toString())
  }

  def start() = Action {
    Ok(tui.toString())
  }
}
