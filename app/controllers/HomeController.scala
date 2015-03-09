package controllers

import model.ConsultationSearchRequest
import play.api.mvc._
import services.ConsultationManager

class HomeController() extends Controller {

  def index = Action {
    new ConsultationManager().search(new ConsultationSearchRequest(-1,"test",-1))
    Ok(views.html.home.index("welcome"))
  }

}