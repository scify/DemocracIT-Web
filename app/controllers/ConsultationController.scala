package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import model.dtos.CommentSource.CommentSource
import model.dtos._
import model.services._
import play.api.mvc._
import play.api.libs.json.{Json, JsValue, JsPath, Writes}



//@Singleton
//class ConsultationController @Inject() (searchManager: SearchManagerAbstract) extends Controller {
class ConsultationController  @Inject()  (implicit val env: Environment[model.User, SessionAuthenticator])
  extends Silhouette[model.User, SessionAuthenticator] {

  private val consultationManager = new ConsultationManager()
  private val commentManager = new CommentManager()

  def search(query:String, ministryId:Option[Int] )= Action {
    val results:List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1,query,ministryId.getOrElse(-1).asInstanceOf[Byte]))
    Ok(views.html.consultation.search(query,results))
  }

  def getConsultation(consultationId :Long) = UserAwareAction { implicit request =>

        Ok(views.html.consultation.index(consultationManager.get(consultationId, request.identity)))
  }

  def getOpenGovComments(consultationId:Long,
                         articleId:Long,
                         discussionThreadId:Option[Int],
                         maxCommentId:Option[Long]) = Action {

    import utils.ImplicitWrites._
    //@todo for now discard consultation id..notice there exists consultations with no articles and all comments are under the consultationid
    val comments = commentManager.getOpenGovComments(consultationId,articleId, maxCommentId)
    Ok(Json.toJson(comments))
  }
}
