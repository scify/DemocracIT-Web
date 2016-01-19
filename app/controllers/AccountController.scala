package controllers

import javax.inject.Inject
import com.mohiva.play.silhouette.api.{Silhouette, Environment, LogoutEvent}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos.User
import model.viewmodels.forms._
import play.api.i18n.MessagesApi
import play.api.mvc.Cookie
import scala.concurrent.Future


class AccountController @Inject() (val messagesApi: MessagesApi,
                                   val env: Environment[User, CookieAuthenticator],
                                   socialProviderRegistry: SocialProviderRegistry)
                        extends Silhouette[User, CookieAuthenticator] {

  /**
   * Handles the Sign In action.
   *
   * @return The result to display.
   */
  //todo: handle returnUrl from query string and redirect there
  def signIn(returnUrl:Option[String]) = UserAwareAction.async { implicit request =>
    request.identity match {
      case Some(user) => {
        Future.successful(Redirect(routes.HomeController.index()))
      }
      case None => {
        val view = views.html.account.signIn(SignInForm.form,returnUrl, socialProviderRegistry)
        //there is no easy way to redirect user to the return url after a facebook/twitter login.
        //For this reason we the page is about to open we save to a cookie the returnUrl parameter
        val result =   if (returnUrl.isDefined) Ok(view).withCookies(Cookie("returnUrl", returnUrl.get))
                     else Ok(view)

        Future.successful(result)
      }
    }
  }

//  /**
//   * Handles the Sign Up action.
//   *
//   * @return The result to display.
//   */
//  //todo: handle returnUrl from query string and redirect there
//  def signUp = UserAwareAction.async { implicit request =>
//    request.identity match {
//      case Some(user) => Future.successful(Redirect(routes.HomeController.index()))
//      case None => Future.successful(Ok(views.html.account.signUp(SignUpForm.form,socialProviderRegistry)))
//    }
//  }

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