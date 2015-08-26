package controllers


import javax.inject.Inject
import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.services.ConsultationManager
import model.viewmodels.forms._
import play.api.i18n.MessagesApi



class HomeController  @Inject()  ( val messagesApi: MessagesApi,
                                   val env: Environment[model.User, CookieAuthenticator],
                                   socialProviderRegistry: SocialProviderRegistry)
                        extends Silhouette[model.User, CookieAuthenticator] {

  val consultationManager = new ConsultationManager

  def index = UserAwareAction { implicit  request =>
    Ok(views.html.home.index(consultationManager.getConsultationsForHomePage(request.identity)))
  }

}