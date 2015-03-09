package controllers

import javax.inject.{Inject, Singleton}

import interfaces.SearchManagerAbstract
import model.ConsultationSearchRequest
import play.api.mvc._
import services.ConsultationManager

//@Singleton
//class ConsultationController @Inject() (searchManager: SearchManagerAbstract) extends Controller {


class ConsultationController() extends Controller {

  def getConsultation(consultationid :Int, name: String) = Action {

    Ok("not implemented")
  }

  def search= Action {

    Ok("not implemented")
  }

  def postSearch= Action {
    val results = new ConsultationManager().search(new ConsultationSearchRequest(-1,"test",-1))
    Ok("not implemented")
  }



}