package controllers

import play.api.mvc._


class HomeController() extends Controller {

  def index = Action {
    //new ConsultationManager().search(new ConsultationSearchRequest(-1,"test",-1))
    Ok(views.html.home.index("welcome"))

  }

}