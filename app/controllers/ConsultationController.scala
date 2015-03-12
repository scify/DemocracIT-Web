package controllers

import democracit.dtos._
import democracit.services._
import play.api.mvc._

//@Singleton
//class ConsultationController @Inject() (searchManager: SearchManagerAbstract) extends Controller {
class ConsultationController() extends Controller {

  private val consultationManager = new ConsultationManager()

  def search(query:String)= Action {
    val results:List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1,query,-1))
    Ok(views.html.consultation.search(query,results))
  }

  def getConsultation(consultationId :Long) = Action {
        Ok(views.html.consultation.index(consultationManager.get(consultationId)))
  }

}