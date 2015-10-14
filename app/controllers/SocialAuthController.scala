package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers._
import model.User
import model.services.UserService
import play.api.i18n.{ MessagesApi, Messages }
import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc.Action

import scala.concurrent.Future

/**
 * The social auth controller.
 *
 * @param messagesApi The Play messages API.
 * @param env The Silhouette environment.
 * @param userService The user service implementation.
 * @param authInfoRepository The auth info service implementation.
 * @param socialProviderRegistry The social provider registry.
 */
class SocialAuthController @Inject() (
                                       val messagesApi: MessagesApi,
                                       val env: Environment[model.User, CookieAuthenticator],
                                       userService: UserService,
                                       authInfoRepository: AuthInfoRepository,
                                       socialProviderRegistry: SocialProviderRegistry)
  extends Silhouette[model.User, CookieAuthenticator] with Logger {

  /**
   * Authenticates a user against a social provider.
   *
   * @param provider The ID of the provider to authenticate against.
   * @return The result to display.
   */
  def authenticate(provider: String) = Action.async { implicit request =>
    {
      //retrieve the return url if it exists in the cookie. This is the easiest way to redirect the user after a social login
      var returnUrl = request.session.get("returnUrl")

      (socialProviderRegistry.get[SocialProvider](provider) match {
        case Some(p: SocialProvider with CommonSocialProfileBuilder) =>
            p.authenticate().flatMap {
              case Left(result) =>Future.successful( result)
              case Right(authInfo) =>{
                val authResult =if (returnUrl.isDefined) Redirect(returnUrl.get,303)
                                else Redirect(routes.HomeController.index())
                for {
                  profile <- p.retrieveProfile(authInfo)
                  user <- userService.save(profile)
                  authInfo <- authInfoRepository.save(profile.loginInfo, authInfo)
                  authenticator <- env.authenticatorService.create(profile.loginInfo)
                  value <- env.authenticatorService.init(authenticator)
                  result <- env.authenticatorService.embed(value, authResult )
                } yield {
                  env.eventBus.publish(LoginEvent(user, request, request2Messages))
                  result.removingFromSession("returnUrl") //return url not needed any more
                }
              }
            }
        case _ => Future.failed(new ProviderException(s"Cannot authenticate with unexpected social provider $provider"))
      }).recover {
        case e: ProviderException =>
          logger.error("Unexpected provider error", e)
          Redirect(routes.AccountController.signIn(returnUrl)).flashing("error" -> Messages("could.not.authenticate"))
      }
    }
  }
}
