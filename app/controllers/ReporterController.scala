package controllers

import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos.User
import model.services.{GamificationEngineTrait, AnnotationManager, ConsultationManager, ReporterManager}
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc.Action


class ReporterController  @Inject()  (val messagesApi: MessagesApi,
                                      val env: Environment[User, CookieAuthenticator],
                                      socialProviderRegistry: SocialProviderRegistry,
                                      val gamificationEngine:GamificationEngineTrait)
                        extends Silhouette[User, CookieAuthenticator] {

  val consultationManager = new ConsultationManager(gamificationEngine)
  private val commentManager = new AnnotationManager(gamificationEngine)
  private val reporterManager = new ReporterManager()

  def getCommentsForConsultationByUserId(consultationId:Long,
                  userId:UUID
                   ) = UserAwareAction {  implicit request =>

    import utils.ImplicitReadWrites._
    val comments = reporterManager.getCommentsForConsultationByUserId(consultationId, userId, request.identity)
    Ok(Json.toJson(comments))
  }

  def getArticleWordCloud(articleId :Long )= Action {  implicit request =>
  {
    val results = reporterManager.getArticleWordCloud(articleId)
    Ok(results)
  }
  }

  def getOpenGovCommentsByArticleId(articleId: Long) = UserAwareAction { implicit request =>
    val comments = reporterManager.getOpenGovCommentsByArticleId(articleId)
    import utils.ImplicitReadWrites._
    Ok(Json.toJson(comments))
  }

  def getDITCommentsByArticleId(articleId: Long) = UserAwareAction { implicit request =>
    val comments = reporterManager.getDITCommentsByArticleId(articleId)
    import utils.ImplicitReadWrites._
    Ok(Json.toJson(comments))
  }

  def getCommentsByAnnId(annId: Long, consultationId: Long) = UserAwareAction { implicit request =>
    val comments = reporterManager.getCommentsByAnnId(annId, consultationId)
    import utils.ImplicitReadWrites._
    Ok(Json.toJson(comments))
  }

  def getCommentsByAnnIdPerArticle(annId: Long, articleId: Long) = UserAwareAction { implicit request =>
    val comments = reporterManager.getCommentsByAnnIdPerArticle(annId, articleId)
    import utils.ImplicitReadWrites._
    Ok(Json.toJson(comments))
  }

  def getOpenGovCommentsCSV(consultationId: Long) = UserAwareAction { implicit request =>
    val response = OK
    val comments = reporterManager.getOpenGovCommentsCSV(consultationId)
    Ok(comments).withHeaders(("Content-Type", "text/csv"), ("Content-Disposition", "attachment;filename=consultationCommentsOpenGov.csv"))
  }

  def getDITCommentsCSV(consultationId: Long) = UserAwareAction { implicit request =>
    val response = OK
    val comments = reporterManager.getDITCommentsCSV(consultationId)
    Ok(comments).withHeaders(("Content-Type", "text/csv"), ("Content-Disposition", "attachment;filename=consultationCommentsDIT.csv"))
  }

  def getAnnotationsForConsultationCSV(consultationId: Long) = UserAwareAction { implicit request =>
    val response = OK
    val comments = reporterManager.getAnnotationsForConsultationCSV(consultationId)
    Ok(comments).withHeaders(("Content-Type", "text/csv"), ("Content-Disposition", "attachment;filename=consultationCommentsPerAnnotationTag.csv"))
  }

  def getProblemsForConsultationCSV(consultationId: Long) = UserAwareAction { implicit request =>
    val response = OK
    val comments = reporterManager.getProblemsForConsultationCSV(consultationId)
    Ok(comments).withHeaders(("Content-Type", "text/csv"), ("Content-Disposition", "attachment;filename=consultationCommentsPerProblemTag.csv"))
  }
}