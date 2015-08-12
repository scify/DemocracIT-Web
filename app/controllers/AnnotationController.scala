package controllers

import javax.inject.{Inject, Singleton}

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.{CookieAuthenticator, SessionAuthenticator}
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import forms._
import model.dtos._
import model.services.AnnotationManager
import model.viewmodels.forms.RateCommentForm
import org.joda.time.DateTime
import play.api.i18n.MessagesApi
import play.api.libs.json.{Json, JsValue, JsPath, Writes}
import utils.ImplicitWrites.FormErrorWrites

class AnnotationController @Inject() (val messagesApi: MessagesApi,
                                      val env: Environment[model.User, CookieAuthenticator],
                                      socialProviderRegistry: SocialProviderRegistry)
              extends Silhouette[model.User, CookieAuthenticator] {

  var annotationManager = new AnnotationManager()

  def rateComment() = SecuredAction { implicit request =>

      RateCommentForm.form.bindFromRequest.fold(
        form => {
          UnprocessableEntity(Json.toJson(form.errors))
        },
        rating => {
          annotationManager.rateComment(request.identity.userID,rating.comment_id,rating.liked)
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
       val discussionthread =DiscussionThread(annotation.discussionThreadId,annotation.discussionThreadClientId,annotation.discusionThreadText,None)
       val comment = Comment(None, annotation.articleId,CommentSource.OpenGov,
                           annotation.body,
                           annotation.userAnnotatedText,
                           Some(request.identity.userID),
                           request.identity.fullName.get,
                           DateTime.now().toDate,
                           1,
                           "",
                          annotation.annotationTagProblems.map(a => AnnotationTags(a.value.getOrElse(-1),a.text,2)).toList,
                          annotation.annotationTagTopics.map(a => AnnotationTags(a.value.getOrElse(-1),a.text,1)).toList,
                          Some(discussionthread),0,0,None)

       val savedComment = annotationManager.saveComment(comment)
       Ok(Json.toJson(savedComment))
     }
    )

  }
  
  def extractTags() = SecuredAction { implicit request =>
        val text = request.request.body.asText.get
        Ok(Json.toJson(annotationManager.extractTags(text)))
  }
}