package controllers

import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.services.{AnnotationManager, ConsultationManager, ReporterManager}
import play.api.i18n.MessagesApi
import play.api.libs.json.Json


class ReporterController  @Inject()  ( val messagesApi: MessagesApi,
                                   val env: Environment[model.User, CookieAuthenticator],
                                   socialProviderRegistry: SocialProviderRegistry)
                        extends Silhouette[model.User, CookieAuthenticator] {

  val consultationManager = new ConsultationManager
  private val commentManager = new AnnotationManager()
  private val reporterManager = new ReporterManager()

  def getCommentsForConsultationByUserId(consultationId:Long,
                  userId:UUID
                   ) = UserAwareAction {  implicit request =>

    import utils.ImplicitReadWrites._
    println("Hello, world")
    val comments = reporterManager.getCommentsForConsultationByUserId(consultationId, userId, request.identity)
    Ok(Json.toJson(comments))
  }

  def getCommentsByArticleId(articleId: Long) = UserAwareAction { implicit request =>
    val comments = reporterManager.getCommentsByArticleId(articleId)
    import utils.ImplicitReadWrites._
    Ok(Json.toJson(comments))
  }

}