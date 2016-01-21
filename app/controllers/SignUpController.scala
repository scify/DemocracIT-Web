package controllers

import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.services.{ AvatarService }
import com.mohiva.play.silhouette.api.util.{PasswordInfo, PasswordHasher}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers._
import model.dtos.User
import model.viewmodels.forms.SignUpForm
import model.services.{TokenUser, TokenService, UserService}

import play.api.i18n.{MessagesApi, Messages}
import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc.{Result, Action}
import utils.{Mailer, MailService}

import scala.concurrent.Future
import scala.reflect.ClassTag

/**
 * The sign up controller.
 *
 * @param env The Silhouette environment.
 * @param userService The user service implementation.
 * @param avatarService The avatar service implementation.
 * @param passwordHasher The password hasher implementation.
 */

class SignUpController @Inject() (
                                   val messagesApi: MessagesApi,
                                   val env: Environment[User, CookieAuthenticator],
                                   userService: UserService,
                                   authInfoRepository: AuthInfoRepository,
                                   avatarService: AvatarService,
                                   passwordHasher: PasswordHasher,
                                   tokenService: TokenService[TokenUser],
                                   mailService: MailService,
                                   socialProviderRegistry: SocialProviderRegistry)
  extends Silhouette[User, CookieAuthenticator] {

//  /**
//   * Registers a new user.
//   *
//   * @return The result to display.
//   */
//  def signUp = Action.async { implicit request =>
//    SignUpForm.form.bindFromRequest.fold(
//      form => Future.successful(BadRequest(views.html.account.signUp(form,socialProviderRegistry ))),
//      data => {
//        val loginInfo = LoginInfo(CredentialsProvider.ID, data.email)
//        userService.retrieve(loginInfo).flatMap {
//          case Some(user) =>
//            Future.successful(Redirect(routes.AccountController.signUp()).flashing("error" -> Messages("user.exists")))
//          case None =>
//            val authInfo = passwordHasher.hash(data.password)
//            val user = User(
//              userID = UUID.randomUUID(),
//              loginInfo = loginInfo,
//              firstName = Some(data.firstName),
//              lastName = Some(data.lastName),
//              fullName = Some(data.firstName + " " + data.lastName),
//              email = Some(data.email),
//              avatarURL = None
//            )
//            for {
//              avatar <- avatarService.retrieveURL(data.email)
//              user <- userService.save(user.copy(avatarURL = avatar))
//              authInfo <- authInfoRepository.add(loginInfo, authInfo)
//              authenticator <- env.authenticatorService.create(loginInfo)
//              value <- env.authenticatorService.init(authenticator)
//              result <- env.authenticatorService.embed(value, Redirect(routes.HomeController.index()))
//            } yield {
//              env.eventBus.publish(SignUpEvent(user, request, request2Messages))
//              env.eventBus.publish(LoginEvent(user, request, request2Messages))
//              result
//            }
//        }
//      }
//    )
//  }

  /**
    * Handles the Sign Up action.
    *
    * @return The result to display.
    */
  def signUpRequest = UserAwareAction.async { implicit request =>
    request.identity match {
      case Some(user) => Future.successful(Redirect(routes.HomeController.index()))
      case None => Future.successful(Ok(views.html.account.signUp(SignUpForm.form, socialProviderRegistry)))
      case unknown => Future.failed(new RuntimeException(s"request.identity returned an unexpected type $unknown"))
    }
  }

  /**
    * Registers a new user.
    *
    * @return The result to display.
    */
  def signUpRequestRegistration = Action.async { implicit request =>
    SignUpForm.form.bindFromRequest.fold(
      form => Future.successful(BadRequest(views.html.account.signUp(form,socialProviderRegistry))),
      signUpData => {
        val loginInfo = LoginInfo(CredentialsProvider.ID, signUpData.email)

        userService.retrieve(loginInfo).flatMap {
          case Some(user) =>
            Future.successful(Redirect(routes.SignUpController.signUpRequest()).flashing("error" -> Messages("user.exists")))

          case None =>
            val authInfo = passwordHasher.hash(signUpData.password)
            authInfoRepository.save(loginInfo, authInfo)
            val token = TokenUser(signUpData.email, true, signUpData.firstName, signUpData.lastName)
            tokenService.create(token)
            utils.Mailer.welcome(signUpData, link = routes.SignUpController.signUpCompletion(token.id).absoluteURL())(mailService)
            Future.successful(Ok(views.html.account.almostSignedUp(signUpData)))

          case unknown => Future.failed(new RuntimeException(s"userService.retrieve(loginInfo) returned an unexpected type $unknown"))
        }
      }
    )
  }

  def signUpCompletion(token: String) = Action.async { implicit request =>
    executeForToken(token, true, { tokenUser =>
      val loginInfo = LoginInfo(CredentialsProvider.ID, tokenUser.email)

      authInfoRepository.find(loginInfo)(ClassTag(classOf[PasswordInfo])).flatMap {
        case Some(authInfo) =>
          val user = User(
            userID = UUID.randomUUID(),
            loginInfo = loginInfo,
            firstName = Some(tokenUser.firstName),
            lastName = Some(tokenUser.lastName),
            fullName = Some(tokenUser.firstName + " " + tokenUser.lastName),
            email = Some(tokenUser.email),
            avatarURL = None
          )
          for {
            avatar <- avatarService.retrieveURL(tokenUser.email)
            user <- userService.save(user.copy(avatarURL = avatar))
            authenticator <- env.authenticatorService.create(loginInfo)
            value <- env.authenticatorService.init(authenticator)
            result <- env.authenticatorService.embed(value, Redirect(routes.HomeController.index()))

          } yield {
            env.eventBus.publish(SignUpEvent(user, request, request2Messages))
            env.eventBus.publish(LoginEvent(user, request, request2Messages))
            tokenService.consume(tokenUser.id)
            result
          }
        case unknown => Future.failed(new RuntimeException(s"authInfoRepository.find(loginInfo) returned an unexpected type $unknown"))
      }
    })
  }

  // scalastyle:on

  private def executeForToken(token: String, isSignUp: Boolean, f: TokenUser => Future[Result]): Future[Result] = {
    tokenService.retrieve(token).flatMap[Result]{ optTokenUser =>
      optTokenUser match {
        case Some(t) if !t.isExpired && t.isSignUp == isSignUp => f(t)
        case _ => Future.successful(NotFound(views.html.account.invalidToken("Θα πρέπει να γραφτείτε ξανά στην πλατφόρμα")))
      }
    }
  }
}
