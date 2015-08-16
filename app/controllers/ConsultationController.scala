package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.{CookieAuthenticator, SessionAuthenticator}
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos.CommentSource.CommentSource
import play.api.cache.Cached
import model.dtos._
import model.services._
import play.api.i18n.MessagesApi
import play.api.mvc._
import play.api.libs.json.{Json, JsValue, JsPath, Writes}



class ConsultationController  @Inject() (val cached: Cached ,val messagesApi: MessagesApi,
                                         val env: Environment[model.User, CookieAuthenticator],
                                         socialProviderRegistry: SocialProviderRegistry)
  extends Silhouette[model.User, CookieAuthenticator] {

  private val consultationManager = new ConsultationManager()
  private val commentManager = new AnnotationManager()
  private val reporterManager = new ReporterManager()

  def displayAll()= //cached("displayall",10) {
      Action { implicit request =>
      {
        val results:List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1,"",-1))

        implicit object Consultatites extends Writes[Consultation] {
          override def writes(c:Consultation):JsValue = Json.arr(
            (if (c.isActive) "λήξη σε:" else "έληξε: ")  + c.endDateFormatted,
            "<a href='/consultation/"+c.id+"'>"+c.title+"</a>" ,
            c.articlesNum.toString + (if (c.articlesNum==1) " άρθρo" else " άρθρα")
          )
        }
        Ok(views.html.consultation.search("",Json.toJson(results),results.length))
      }
    }
  //}



  def search(query:String,ministryId:Option[Int] )= Action {  implicit request =>
    {
      val results:List[Consultation] = consultationManager.search(new ConsultationSearchRequest(-1,"",-1))
      import utils.ImplicitReadWrites._
      Ok(Json.toJson(results))
    }
  }

  def getConsultation(consultationId :Long) = UserAwareAction { implicit request =>

        Ok(views.html.consultation.index(consultationManager.get(consultationId, request.identity)))
  }

  def getAnnotatorPage(consultationId :Long) = UserAwareAction { implicit request =>
    Ok(views.html.consultation.index(consultationManager.get(consultationId, request.identity)))
  }
  
  def getReporterPage(consultationId :Long) = UserAwareAction { implicit request =>
        Ok(views.html.consultation.reporter(reporterManager.get(consultationId, request.identity)))
  }

  def getComments(consultationId:Long,
                   articleId:Long,
                   source: String ,
                   discussionthreadid:Option[Int] ,
                   discussionthreadclientid:String,
                   page:Option[Int]
                   ) = UserAwareAction {  implicit request =>

    import utils.ImplicitReadWrites._

    val comments = commentManager.getComments(consultationId,articleId,
                                              source,
                                              discussionthreadid,
                                              discussionthreadclientid,
                                              if (request.identity.isDefined) Some(request.identity.get.userID) else None)
    Ok(Json.toJson(comments))
  }
}
