package controllers

import javax.inject.{Inject, Singleton}

import interfaces.SearchManagerAbstract
import model.ConsultationSearchRequest
import play.api.mvc._

@Singleton
class ConsultationController @Inject() (searchManager: SearchManagerAbstract) extends Controller {

  def getConsultation(consultationid :Int, name: String) = Action {
    //feth the consultation
    Ok("not implemented")
  }

  def search= Action {
    //todo: open search page
    Ok("not implemented")
  }

  def postSearch= Action {
    val results =  this.searchManager.search(new ConsultationSearchRequest(-1,"test",-1))
    Ok("not implemented")
  }



}