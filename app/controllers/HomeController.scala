package controllers


import javax.inject.Inject
import com.mohiva.play.silhouette.api.{Silhouette, Environment, LogoutEvent}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import model.dtos.CommentSource
import model.services.{CommentManager, ConsultationManager}
import forms._
import org.joda.time.DateTime
import scala.concurrent.Future



class HomeController  @Inject()  (implicit val env: Environment[model.User, SessionAuthenticator])
                        extends Silhouette[model.User, SessionAuthenticator] {

  val consultationManager = new ConsultationManager

  def index = UserAwareAction { implicit  request =>
    Ok(views.html.home.index(consultationManager.getConsultationsForHomePage(request.identity)))
  }

}