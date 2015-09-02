package controllers


import javax.inject.Inject
import com.mohiva.play.silhouette.api.{Silhouette, Environment, LogoutEvent}
import com.mohiva.play.silhouette.impl.authenticators.{CookieAuthenticator, SessionAuthenticator}
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos.CommentSource
import model.services.{AnnotationManager, ConsultationManager}
import forms._
import org.joda.time.DateTime
import play.api.i18n.MessagesApi
import play.api.mvc.Action
import scala.concurrent.Future



class HomeController  @Inject()  ( val messagesApi: MessagesApi,
                                   val env: Environment[model.User, CookieAuthenticator],
                                   socialProviderRegistry: SocialProviderRegistry)
                        extends Silhouette[model.User, CookieAuthenticator] {

  val consultationManager = new ConsultationManager

  def index = UserAwareAction { implicit  request =>
    Ok(views.html.home.index(consultationManager.getConsultationsForHomePage(request.identity)))
  }

  //used from the CMS in order to retrieve the footer's html and attach it inside the CMS
  def footer = Action {
    Ok(views.html.common.footer())
  }

  //used from the CMS in order to retrieve the header's html and attach it inside the CMS
  def header = UserAwareAction { implicit  request =>
    Ok(views.html.common.navbar(request.identity))
  }

}