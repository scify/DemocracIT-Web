package controllers

import java.util.{Calendar, UUID}
import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Environment, Silhouette}
import com.mohiva.play.silhouette.impl.authenticators.CookieAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import model.dtos._
import model.services.{MailerManager, UserProfileManager, AnnotationManager, GamificationEngineTrait}
import model.viewmodels.forms.{RateCommentForm, _}
import org.joda.time.DateTime
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import utils.ImplicitReadWrites.FormErrorWrites
import utils.ImplicitReadWrites.commentsWrites
import utils.MailService

class AnnotationController @Inject() (val messagesApi: MessagesApi,
                                      val env: Environment[User, CookieAuthenticator],
                                      socialProviderRegistry: SocialProviderRegistry,
                                      val gamificationEngine:GamificationEngineTrait, mailService: MailService)
              extends Silhouette[User, CookieAuthenticator] {

  var annotationManager = new AnnotationManager(gamificationEngine, mailService)

  def rateComment() = SecuredAction { implicit request =>

      RateCommentForm.form.bindFromRequest.fold(
        form => {
          UnprocessableEntity(Json.toJson(form.errors))
        },
        rating => {
          annotationManager.rateComment(request.identity.userID,rating.comment_id,rating.liked, rating.commenterId, rating.annId, rating.articleId, rating.consultationId)
          Created("")
        }
      )
  }

  def annotatePost() =  SecuredAction { implicit request =>

    import utils.ImplicitReadWrites._

    AnnotationForm.form.bindFromRequest.fold(
     form => {
       UnprocessableEntity(Json.toJson(form.errors))
     },
     annotation => {
       val discussionthread =DiscussionThread(annotation.discussionThreadId,
         annotation.discussionThreadTypeId.get,annotation.discussionThreadClientId.get,
         annotation.discusionThreadText.get,None)

       val comment = Comment(None, annotation.articleId, None, CommentSource.OpenGov,
                           annotation.body,
                           annotation.userAnnotatedText,
                           Some(request.identity.userID),
                           request.identity.fullName.get,
                           request.identity.avatarURL,
                           None,
                           DateTime.now().toDate,
                           1,
                           "",
                          annotation.annotationTagProblems.map(a => AnnotationTags(a.value.getOrElse(-1),a.text,2)).toList,
                          annotation.annotationTagTopics.map(a => AnnotationTags(a.value.getOrElse(-1),a.text,1)).toList,
                          Some(discussionthread),0,0,None,Nil,annotation.emotionId)

       val savedComment = annotationManager.saveComment(comment)
       Ok(Json.toJson(savedComment))
     }
    )

  }

  def updatePost() =  SecuredAction { implicit request =>

    import utils.ImplicitReadWrites._
    val e =1
    AnnotationForm.form.bindFromRequest.fold(
      form => {
        UnprocessableEntity(Json.toJson(form.errors))
      },
      annotation => {
        //val discussionthread =DiscussionThread(annotation.discussionThreadId,annotation.discussionThreadTypeId,annotation.discussionThreadClientId,annotation.discusionThreadText,None)
        //when updating a comment, we do not need to specify a new discussion thread (there is one existing)
        val comment = Comment(annotation.commentId, annotation.articleId, None, CommentSource.Democracit,
          annotation.body,
          annotation.userAnnotatedText,
          Some(request.identity.userID),
          request.identity.fullName.get,
          request.identity.avatarURL,
          None,
          DateTime.now().toDate,
          annotation.revision.getOrElse(1),
          "",
          annotation.annotationTagProblems.map(a => AnnotationTags(a.value.getOrElse(-1),a.text,2)).toList,
          annotation.annotationTagTopics.map(a => AnnotationTags(a.value.getOrElse(-1),a.text,1)).toList,
          None,0,0,None,Nil,annotation.emotionId)

        val savedComment = annotationManager.updateComment(comment)
        Ok(Json.toJson(savedComment))
      }
    )

  }

  def saveReply() =  SecuredAction { implicit request =>
    val test = request
    val parameterList = Json.parse(request.body.asJson.get.toString)
    val articleId = (parameterList \ "articleId").asOpt[Long].get
    val parentId = (parameterList \ "parentId").asOpt[Long].get
    val replyText = (parameterList \ "replyText").asOpt[String].get
    val userId = (parameterList \ "userId").asOpt[UUID].get

    val discussionthreadclientid = (parameterList \ "discussionthreadclientid").asOpt[Long].get

    val today = Calendar.getInstance.getTime
    val emptyAnnotationTags:List[AnnotationTags] = Nil
    val commentId = annotationManager.saveReply(articleId, parentId, discussionthreadclientid, replyText, userId)
    val userManager = new UserProfileManager()
    val comment:Comment = new Comment(Some(commentId), articleId, Some(parentId), CommentSource.Democracit, replyText, None, None, userManager.getUserFullNameById(userId), None, None, today ,1, "2", emptyAnnotationTags, emptyAnnotationTags, None, 0, 0, None,Nil,None)
    //TODO: Send email to commenter
    val commenterId = (parameterList \ "commenterId").asOpt[UUID].get
    val annotationId = (parameterList \ "annotationId").asOpt[String].get
    val consultationId = (parameterList \ "consultationId").asOpt[Long].get

    sendEmailToCommenter(commenterId, consultationId, articleId, annotationId, parentId, replyText)
    Ok(Json.toJson(comment))

  }

  def sendEmailToCommenter(userId:UUID, consultationId:Long, articleId:Long, annotationId:String, commentId:Long, commentText:String): Unit = {
    var linkToShowComment = ""
    val userProfileManager = new UserProfileManager()
    val userEmail = userProfileManager.getUserEmailById(userId)
    if(play.Play.application().configuration().getString("application.state") == "development") {
      linkToShowComment += "http://localhost:9000/consultation/"
    } else {
      linkToShowComment += "http://democracit.org/consultation/"
    }
    linkToShowComment += consultationId + "#articleid=" + articleId + "&annid=" + annotationId + "&commentid=" + commentId
    MailerManager.sendEmailToCommenter(userEmail, commentText, linkToShowComment)(mailService)
  }
  
  def extractTags() = SecuredAction { implicit request =>
        val text = request.request.body.asText.get
        Ok(Json.toJson(annotationManager.extractTags(text)))
  }
}