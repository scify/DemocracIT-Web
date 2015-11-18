package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.services.EvaluationManager
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import utils.ImplicitReadWrites._

class EvaluationController @Inject()  ( val messagesApi: MessagesApi,
                                        val env: Environment[model.User, CookieAuthenticator],
                                        socialProviderRegistry: SocialProviderRegistry)
                                        extends Silhouette[model.User, CookieAuthenticator] {
  val evaluationManager = new EvaluationManager

  def getEvaluationPage() = UserAwareAction { implicit request =>

    Ok(views.html.evaluation(evaluationManager.get(request.identity)))
  }

  def getEvaluationPerOrganization() = UserAwareAction { implicit request =>
    val frequencies = evaluationManager.getEvaluationPerOrganization()
    Ok(Json.toJson(frequencies))
  }

  def getConsDurationPerOrganization() = UserAwareAction { implicit request =>
    val durations = evaluationManager.getConsDurationPerOrganization()
    Ok(Json.toJson(durations))
  }

}
