package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.services.EvaluationManager
import play.api.i18n.MessagesApi

class EvaluationController @Inject()  ( val messagesApi: MessagesApi,
                                        val env: Environment[model.User, CookieAuthenticator],
                                        socialProviderRegistry: SocialProviderRegistry)
                                        extends Silhouette[model.User, CookieAuthenticator] {
  val evaluationManager = new EvaluationManager

  def getEvaluationPage() = UserAwareAction { implicit request =>

    Ok(views.html.evaluation(evaluationManager.get(request.identity)))
  }

}
