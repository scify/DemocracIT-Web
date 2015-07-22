package controllers

import javax.inject.{Inject, Singleton}

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import forms._
import model.dtos._
import model.services.CommentManager
import model.viewmodels.forms.RateCommentForm
import org.joda.time.DateTime
import play.api.libs.json.{Json, JsValue, JsPath, Writes}
import utils.ImplicitWrites.FormErrorWrites

class AnnotationController @Inject() (implicit val env: Environment[model.User, SessionAuthenticator]) extends Silhouette[model.User, SessionAuthenticator] {

  var commentManager = new CommentManager()

  def rateComment() = SecuredAction { implicit request =>

      RateCommentForm.form.bindFromRequest.fold(
        form => {
          UnprocessableEntity(Json.toJson(form.errors))
        },
        rating => {
          commentManager.rateComment(request.identity.userID,rating.comment_id,rating.liked)
          Created("")
        }
      )
  }

  def annotatePost() =  SecuredAction { implicit request =>

    import utils.ImplicitWrites._

    AnnotationForm.form.bindFromRequest.fold(
     form => {
       UnprocessableEntity(Json.toJson(form.errors))
     },
     annotation => {
        val annotationTags = List(AnnotationTags(annotation.annotationTagId,annotation.annotationTagText))
       val discussionthread =DiscussionThread(annotation.discussionThreadId,annotation.discussionThreadClientId,annotation.discusionThreadText,None)
       val comment = Comment(None, annotation.articleId,CommentSource.OpenGov,
                           annotation.body,
                           annotation.userAnnotatedText,
                           Some(request.identity.userID),
                           request.identity.fullName.get,
                           DateTime.now().toDate,
                           1,"",annotationTags,Some(discussionthread),0,0,None)

       val savedComment = commentManager.saveComment(comment)
       Ok(Json.toJson(savedComment))
     }
    )

  }
}