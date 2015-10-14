package controllers

import javax.inject.Inject
import com.mohiva.play.silhouette.api.{Silhouette, Environment, LogoutEvent}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.viewmodels.forms._
import play.api.i18n.MessagesApi
import scala.concurrent.Future


class AccountController @Inject() (val messagesApi: MessagesApi,
                                   val env: Environment[model.User, CookieAuthenticator],
                                   socialProviderRegistry: SocialProviderRegistry)
                        extends Silhouette[model.User, CookieAuthenticator] {

  /**
   * Handles the Sign In action.
   *
   * @return The result to display.
   */
  //todo: handle returnUrl from query string and redirect there
  def signIn(returnUrl:Option[String]) = UserAwareAction.async { implicit request =>
    request.identity match {
      case Some(user) => Future.successful(Redirect(routes.HomeController.index()))
      case None => Future.successful(Ok(views.html.account.signIn(SignInForm.form,returnUrl, socialProviderRegistry)))
    }
  }

  /**
   * Handles the Sign Up action.
   *
   * @return The result to display.
   */
  //todo: handle returnUrl from query string and redirect there
  def signUp = UserAwareAction.async { implicit request =>
    request.identity match {
      case Some(user) => Future.successful(Redirect(routes.HomeController.index()))
      case None => Future.successful(Ok(views.html.account.signUp(SignUpForm.form,socialProviderRegistry)))
    }
  }

  /**
   * Handles the Sign Out action.
   *
   * @return The result to display.
   */
  def signOut = SecuredAction.async { implicit request =>
    val result = Redirect(routes.HomeController.index())
    env.eventBus.publish(LogoutEvent(request.identity, request, request2Messages))

    env.authenticatorService.discard(request.authenticator, result)
  }

}