package controllers

import javax.inject.{Inject, Singleton}

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.SessionAuthenticator
import forms._
import model.dtos._
import model.services.CommentManager
import org.joda.time.DateTime
import play.api.libs.json.{Json, JsValue, JsPath, Writes}
import utils.ImplicitWrites.FormErrorWrites

class AnnotationController @Inject() (implicit val env: Environment[model.User, SessionAuthenticator]) extends Silhouette[model.User, SessionAuthenticator] {

  def annotatePost() =  SecuredAction { implicit request =>

    //request.identity contains an Option[User]
    AnnotationForm.form.bindFromRequest.fold(
     form => {
       UnprocessableEntity(Json.toJson(form.errors))
     },
     annotation => {
        val annotationTags = List(AnnotationType(annotation.annotationTagId,""))
       val discussionthread =DiscussionThread(-1,annotation.discussionThreadClientId,annotation.discusionThreadText,None)
       val comment = Comment(-1, annotation.articleId,CommentSource.OpenGov,
                           annotation.body,
                           request.identity.userID.toString,
                           request.identity.fullName.get,
                           DateTime.now().toDate,
                           1,"",annotationTags,Some(discussionthread))

        val cman = new CommentManager()
       val savedComment = cman.saveComment(comment)
       Ok(Json.toJson(savedComment.id))
     }
    )

  }
}