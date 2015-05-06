package controllers

import javax.inject.Inject
import com.mohiva.play.silhouette.api.{Silhouette, Environment, LogoutEvent}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import forms._
import scala.concurrent.Future

/**
 * The basic application controller.
 *
 * @param env The Silhouette environment.
 */
@deprecated("will be completely removed soon, stayed here just for reference")
class ApplicationController @Inject() (implicit val env: Environment[model.User, SessionAuthenticator])
  extends Silhouette[model.User, SessionAuthenticator] {

  /**
   * Handles the index action.
   *
   * @return The result to display.
   */
//  def index = SecuredAction.async { implicit request =>
//    Future.successful(Ok(views.html.home(request.identity)))
//  }
//
//  /**
//   * Handles the Sign In action.
//   *
//   * @return The result to display.
//   */
//  def signIn = UserAwareAction.async { implicit request =>
//    request.identity match {
//      case Some(user) => Future.successful(Redirect(routes.ApplicationController.index()))
//      case None => Future.successful(Ok(views.html.signIn(SignInForm.form)))
//    }
//  }
//
//  /**
//   * Handles the Sign Up action.
//   *
//   * @return The result to display.
//   */
//  def signUp = UserAwareAction.async { implicit request =>
//    request.identity match {
//      case Some(user) => Future.successful(Redirect(routes.ApplicationController.index()))
//      case None => Future.successful(Ok(views.html.signUp(SignUpForm.form)))
//    }
//  }
//
//  /**
//   * Handles the Sign Out action.
//   *
//   * @return The result to display.
//   */
//  def signOut = SecuredAction.async { implicit request =>
//    val result = Future.successful(Redirect(routes.ApplicationController.index()))
//    env.eventBus.publish(LogoutEvent(request.identity, request, request2lang))
//
//    request.authenticator.discard(result)
//  }
}
