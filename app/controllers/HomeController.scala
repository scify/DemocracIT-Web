package controllers

import play.api.mvc._

class HomeController() extends Controller {

  def index = Action {
    Ok(views.html.index("welcome"))
  }

}