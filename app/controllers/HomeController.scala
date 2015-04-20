package controllers

import democracit.services.ConsultationManager
import play.api.mvc._


class HomeController() extends Controller {

  val consultationManager = new ConsultationManager

  def index = Action {

    Ok(views.html.home2.index2(consultationManager.getConsultationsForHomePage()))

  }

}