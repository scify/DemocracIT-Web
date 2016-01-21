package controllers


import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos.User
import model.services.{ConsultationManager, GamificationEngineTrait}
import play.api.i18n.MessagesApi
import play.api.mvc.Action



class HomeController  @Inject()  (val messagesApi: MessagesApi,
                                  val env: Environment[User, CookieAuthenticator],
                                  socialProviderRegistry: SocialProviderRegistry,
                                  val gamificationEngine:GamificationEngineTrait)
                        extends Silhouette[User, CookieAuthenticator] {

  val consultationManager = new ConsultationManager(gamificationEngine)

  def index = UserAwareAction { implicit  request =>
    Ok(views.html.home.index(consultationManager.getConsultationsForHomePage(request.identity)))
  }

  //used from the CMS in order to retrieve the footer's html and attach it inside the CMS
  def footer = Action { implicit  request =>

    Ok(views.html.common.footer()).withHeaders(("Access-Control-Allow-Origin","*"))
  }

  //used from the CMS in order to retrieve the header's html and attach it inside the CMS
  def header = UserAwareAction { implicit  request =>
    Ok(views.html.common.navbar(request.identity)).withHeaders(("Access-Control-Allow-Origin","*"))
  }

}