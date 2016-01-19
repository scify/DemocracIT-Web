// scalastyle:off
package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.Silhouette
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import com.mohiva.play.silhouette.impl.providers.{SocialProviderRegistry, CredentialsProvider}
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.services.AvatarService
import com.mohiva.play.silhouette.api.util.{Credentials, PasswordInfo, PasswordHasher}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import controllers.PasswordChangeController.ChangeInfo
import model.dtos.User
import model.services.{TokenUser, TokenService, UserService}
import model.viewmodels.forms.SignUpForm
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.Constraints._
import play.api.i18n.{ MessagesApi, Messages }
import play.api.mvc._
import play.api.{Logger}
import play.api.libs.concurrent.Execution.Implicits._
import utils.{MailService, Mailer}

import scala.language.postfixOps
import scala.concurrent.Future
import scala.reflect.ClassTag


/**
 * A controller to provide password change functionality
 */
class PasswordChangeController @Inject() (
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

  val providerId = CredentialsProvider.ID
  val Email = "email"
  val passwordValidation = nonEmptyText(minLength = 6)


  def startResetPassword = Action { implicit request =>
    ???
  }
  def handleStartResetPassword = Action { implicit request =>
    ???
  }

  def specifyResetPassword(token:String) = Action { implicit request =>
    ???
  }

  def handleResetPassword = Action { implicit request =>
    ???
  }
}

object PasswordChangeController {
  case class ChangeInfo(currentPassword: String, newPassword: String)
}
// scalastyle:on