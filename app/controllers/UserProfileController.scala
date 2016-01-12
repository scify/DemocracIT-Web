package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import play.api.i18n.MessagesApi
import model.services._

class UserProfileController @Inject()(val messagesApi: MessagesApi,
                                      val env: Environment[model.User, CookieAuthenticator],
                                      socialProviderRegistry: SocialProviderRegistry)
  extends Silhouette[model.User, CookieAuthenticator] {

  val userProfileManager = new UserProfileManager

  def getUserPage() = UserAwareAction { implicit request =>

    Ok(views.html.account.user_profile(userProfileManager.get(request.identity.get.userID)))
  }


}
