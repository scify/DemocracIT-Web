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

    val articleId = 60034
    val consultationId = 60035

    val commentsManager = new CommentManager();
    val comment = model.dtos.Comment(id = -1,
                articleId = articleId,
                source = CommentSource.Democracit,
                body = "αυτό ειναι ενα δοκιμαστικό σχόλιο",
                userId = 1,
                fullName = "alexandros tzoumas",
                dateAdded = DateTime.now().toDate ,
                revision = 1 ,
                depth = "1",
                annotations = Nil,
                discussionThread = None)

    val result =commentsManager.saveComment(comment,articleId+"ann-0", "whole text")

    Ok(views.html.home.index(consultationManager.getConsultationsForHomePage(request.identity)))
  }

}