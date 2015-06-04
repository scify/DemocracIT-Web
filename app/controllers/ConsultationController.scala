package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import model.dtos._
import model.services._
import play.api.mvc._

//@Singleton
//class ConsultationController @Inject() (searchManager: SearchManagerAbstract) extends Controller {
class ConsultationController  @Inject()  (implicit val env: Environment[model.User, SessionAuthenticator])
  extends Silhouette[model.User, SessionAuthenticator] {

  private val consultationManager = new ConsultationManager()

  def search(query:String)= Action {
    val results:List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1,query,-1))
    Ok(views.html.consultation.search(query,results))
  }

  def getConsultation(consultationId :Long) = UserAwareAction { implicit request =>
        Ok(views.html.consultation.index(consultationManager.get(consultationId)))
  }

}