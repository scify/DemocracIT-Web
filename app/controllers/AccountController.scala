package controllers

import javax.inject.Inject
import com.mohiva.play.silhouette.api.{Silhouette, Environment, LogoutEvent}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import forms._
import play.api.mvc.Action
import scala.concurrent.Future


class AccountController @Inject()
      (implicit val env: Environment[model.User, SessionAuthenticator]) extends Silhouette[model.User, SessionAuthenticator] {

//  //todo: fix
//  def tokenRetrieve = Action { implicit request =>
//
//    import play.api.libs.json._
//    implicit object token extends Writes[model.dtos.JsToken] {
//      def writes(p: model.dtos.JsToken) = Json.obj(
//          "consumerKey" -> Json.toJson(p.consumerKey),
//          "issuedAt" -> Json.toJson(p.issuedAt),
//          "userId" -> Json.toJson(p.userId),
//          "ttl" -> Json.toJson(p.ttl)
//      )
//    }
//
//    Ok(Json.toJson(model.dtos.JsToken("602368a0e905492fae87697edad14c3a","userid","2012-03-23T10:51:18Z",86400)))
//  }

  /**
   * Handles the Sign In action.
   *
   * @return The result to display.
   */
  //todo: handle returnUrl from query string and redirect there
  def signIn = UserAwareAction.async { implicit request =>
    request.identity match {
      case Some(user) => Future.successful(Redirect(routes.HomeController.index()))
      case None => Future.successful(Ok(views.html.account.signIn(SignInForm.form)))
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
      case None => Future.successful(Ok(views.html.account.signUp(SignUpForm.form)))
    }
  }

  /**
   * Handles the Sign Out action.
   *
   * @return The result to display.
   */
  def signOut = SecuredAction.async { implicit request =>
    val result = Future.successful(Redirect(routes.HomeController.index()))
    env.eventBus.publish(LogoutEvent(request.identity, request, request2lang))

    request.authenticator.discard(result)
  }
}