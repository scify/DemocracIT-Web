package utils

import javax.inject.Inject

import com.mohiva.play.silhouette.api.SecuredErrorHandler
import controllers.routes
import play.api.http.DefaultHttpErrorHandler
import play.api.i18n.Messages
import play.api.mvc.Results._
import play.api.mvc.{ Result, RequestHeader }
import play.api.routing.Router
import play.api.{ OptionalSourceMapper, Configuration }


import scala.concurrent.Future

/**
 * A secured error handler.
 */
class ErrorHandler @Inject() (
                               env: play.api.Environment,
                               config: Configuration,
                               sourceMapper: OptionalSourceMapper,
                               router: javax.inject.Provider[Router])
  extends DefaultHttpErrorHandler(env, config, sourceMapper, router)
  with SecuredErrorHandler {

  /**
   * Called when a user is not authenticated.
   *
   * As defined by RFC 2616, the status code of the response should be 401 Unauthorized.
   *
   * @param request The request header.
   * @param messages The messages for the current language.
   * @return The result to send to the client.
   */
  override def onNotAuthenticated(request: RequestHeader, messages: Messages): Option[Future[Result]] = {

        val isAjax = request.headers.get("X-Requested-With") == Some("XMLHttpRequest")
        if (isAjax){
          Some(Future.successful(Unauthorized(play.api.libs.json.Json.toJson(routes.AccountController.signIn.url))))
        }
        else {
          Some(Future.successful(Redirect(routes.AccountController.signIn)))
        }

  }

  /**
   * Called when a user is authenticated but not authorized.
   *
   * As defined by RFC 2616, the status code of the response should be 403 Forbidden.
   *
   * @param request The request header.
   * @param messages The messages for the current language.
   * @return The result to send to the client.
   */
  override def onNotAuthorized(request: RequestHeader, messages: Messages): Option[Future[Result]] = {

        val isAjax = request.headers.get("X-Requested-With") == Some("XMLHttpRequest")

        if (isAjax){
          //todo: move to resources
          Some(Future.successful(Forbidden(play.api.libs.json.Json.toJson("access.denied"))))
        }
        else {
          Some(Future.successful(Redirect(routes.AccountController.signIn)
            .flashing("error" -> "access.denied")))
        }

  }

}
