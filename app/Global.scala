
import com.google.inject.Guice
import com.mohiva.play.silhouette.api.{ Logger, SecuredSettings }
import controllers.routes
import play.Logger
import play.api.GlobalSettings
import play.api.i18n.{ Lang, Messages }
import play.api.mvc.Results._
import play.api.mvc.{ RequestHeader, Result }
import play.api.libs.json.Json
import utils.SilhouetteModule

import scala.concurrent.Future

/**
 * The global object.
 */
object Global extends Global

/**
 * The global configuration.
 */
trait Global extends GlobalSettings with SecuredSettings with com.mohiva.play.silhouette.api.Logger {

//  /**
//   * Bind types such that whenever TextGenerator is required, an instance of WelcomeTextGenerator will be used.
//   */
//  val injector = Guice.createInjector(new AbstractModule {
//    protected def configure() {
//      //bind(classOf[SearchManagerAbstract]).to(classOf[ConsultationManager])
//    }
//  })

  /**
   * The Guice dependencies injector.
   */
  val injector = Guice.createInjector(new SilhouetteModule)

  /**
   * Loads the controller classes with the Guice injector,
   * in order to be able to inject dependencies directly into the controller.
   *
   * @param controllerClass The controller class to instantiate.
   * @return The instance of the controller class.
   * @throws Exception if the controller couldn't be instantiated.
   */
  override def getControllerInstance[A](controllerClass: Class[A]) = injector.getInstance(controllerClass)

  /**
   * Called when a user is not authenticated.
   *
   * As defined by RFC 2616, the status code of the response should be 401 Unauthorized.
   *
   * @param request The request header.
   * @param lang The currently selected language.
   * @return The result to send to the client.
   */
  override def onNotAuthenticated(request: RequestHeader, lang: Lang): Option[Future[Result]] = {

    val isAjax = request.headers.get("X-Requested-With") == Some("XMLHttpRequest")
    if (isAjax){
      Some(Future.successful(Unauthorized(Json.toJson(routes.AccountController.signIn.url))))
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
   * @param lang The currently selected language.
   * @return The result to send to the client.
   */
  override def onNotAuthorized(request: RequestHeader, lang: Lang): Option[Future[Result]] = {
    val isAjax = request.headers.get("X-Requested-With") == Some("XMLHttpRequest")

    if (isAjax){
      //todo: move to resources
      Some(Future.successful(Forbidden(Json.toJson( Messages("access.denied")))))
    }
    else {
      Some(Future.successful(Redirect(routes.AccountController.signIn)
        .flashing("error" -> Messages("access.denied"))))
    }

  }
}
