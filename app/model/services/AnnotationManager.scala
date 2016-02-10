package model.services

import java.util.UUID

import model.dtos._
import model.repositories._
import play.api.Play.current
import play.api.libs.json.JsArray
import play.api.libs.ws.WS
import utils.MailService

import scala.concurrent.Await

class AnnotationManager (gamificationEngine: GamificationEngineTrait, mailService: MailService){

  private val commentsPageSize = 50
  val commentsRepository = new CommentsRepository()
  val consultationRepository = new ConsultationRepository()

  def extractTags(input:String):Seq[String] = {
    import scala.concurrent.ExecutionContext.Implicits.global
    import scala.concurrent.duration._

    Await.result(
    WS.url(play.api.Play.current.configuration.getString("application.webservice.termsExtraction").get)
                    .withHeaders(("Content-Type" ->"application/x-www-form-urlencoded; charset=utf-8"))
                    .post("text="+input) map {
      response => {

      val content =(response.json \ "content")

      val tags = content.get.asInstanceOf[JsArray].value.map( x=>
                        x.toString().replace("\"","")
                ).toList
        tags
      }
    },15 seconds)

  }

  def saveComment(comment:Comment): Comment = {

    if (!comment.discussionThread.get.id.isDefined || comment.discussionThread.get.id.get <= 0) {
     // retrieve the article name from database
      // compare the article name with comment.discussionThread.get.text
      // if it is the same , discussionThread.get.typeid = "Whole article"
      comment.discussionThread.get.id = commentsRepository.saveDiscussionThread(comment.discussionThread.get.clientId, comment.discussionThread.get.text, comment.discussionThread.get.discussion_thread_type_id)
    }
    comment.id= Some(commentsRepository.saveComment(comment, comment.discussionThread.get.id.get).get)
    awardPointsForComment(comment)

    comment
  }

  def updateComment(comment:Comment): Comment = {
    commentsRepository.saveUpdatedComment(comment)
    comment
  }

  private def awardPointsForComment(comment: Comment): Unit = {
    if(comment.userId.isDefined) {
      //check how many comments has the user entered today
      if(commentsRepository.howManyCommentsToday(comment.userId.get) <= 10) {
        if (comment.annotationTagProblems.size != 0) {
          //award points for comment with annotation problems
          gamificationEngine.rewardUser(comment.userId.get, GamificationEngineTrait.COMMENT_WITH_PROBLEM_TAGS, comment.id.get)
        }
        if (comment.annotationTagTopics.size != 0) {
          //award points for comment with annotation tags
          gamificationEngine.rewardUser(comment.userId.get, GamificationEngineTrait.COMMENT_WITH_ANN_TAGS, comment.id.get)
        }
        if(comment.discussionThread.get.discussion_thread_type_id == 2) {
          //awards points for comment that refers to part of the article
          gamificationEngine.rewardUser(comment.userId.get, GamificationEngineTrait.COMMENT_ON_CONSULTATION_PARAGRAPH, comment.id.get)
        } else if(comment.discussionThread.get.discussion_thread_type_id == 1) {
          //awards points for comment that refers to the whole article
          gamificationEngine.rewardUser(comment.userId.get, GamificationEngineTrait.COMMENT_ON_CONSULTATION_ARTICLE, comment.id.get)
        }
      }
    }
  }

  private def getActionsMadeByUserWhileCommenting(comment:Comment): List[Int] = {

    var action_ids = Nil

    // if comment is only for an article
    //action_ids = action_ids ::: GamificationEngineTrait.COMMENT_ON_CONSULTATION

    // if comment has category tags
    //action_ids = action_ids ::: GamificationEngineTrait.COMMENT_ON_CONSULTATION

    //if comment has problem tags

    action_ids
  }

  def sendEmailToCommenterForLike(userId:UUID, consultationId:Long, articleId:Long, annotationId:String, commentId:Long): Unit = {
    var linkToShowComment = ""
    val userProfileManager = new UserProfileManager()
    val userEmail = userProfileManager.getUserEmailById(userId)
    if(play.Play.application().configuration().getString("application.state") == "development") {
      linkToShowComment += "http://localhost:9000/consultation/"
    } else {
      linkToShowComment += "http://democracit.org/consultation/"
    }
    linkToShowComment += consultationId + "#articleid=" + articleId + "&annid=" + annotationId + "&commentid=" + commentId
    MailerManager.sendEmailToCommenterForLike(userEmail, linkToShowComment)(mailService)
  }

  def rateComment(user_id:java.util.UUID, comment_id:Long, liked:Option[Boolean], commenterId:Option[UUID], annId:String, articleId:Long, consultationId:Option[Long]) = {
    if(liked != None) {
      //if the user has liked and has less than 10 likes today
      if(liked.get && commenterId.isDefined) {
        sendEmailToCommenterForLike(commenterId.get, consultationId.get, articleId, annId, comment_id)
      }
      if(liked.get && howManyLikesToday(user_id) < 10) {
        gamificationEngine.rewardUser(user_id,GamificationEngineTrait.LIKE_COMMENT, comment_id)
        //if the user is disliking
      } else if(!liked.get) {
        commentsRepository.cancelLikeReward(user_id, comment_id)
      }
    }
    // if the user is taking back his like
    else if(liked == None) {
      commentsRepository.cancelLikeReward(user_id, comment_id)
    }
    commentsRepository.rateComment(user_id,comment_id,liked)
  }

  def saveReply(articleId:Long, parentId:Long, discussionthreadclientid:Long,replyText:String, userId:UUID):Long = {
    val commentId = commentsRepository.saveCommentReply(replyText, parentId, articleId, discussionthreadclientid, userId)
    commentId
  }

  def saveFinalLawAnnotation(userId:UUID, commentId:Long, finalLawId:Long, annotationIds:List[String]):String = {
    consultationRepository.saveFinalLawAnnotation(userId, commentId, finalLawId, annotationIds)
    val userProfileRepository = new UserProfileRepository()
    val userName = userProfileRepository.getUserFullNameById(userId)
    userName
  }

  def updateFinalLawAnnotation(userId:UUID, commentId:Long, finalLawId:Long, annotationIds:List[String]):String = {
    consultationRepository.updateFinalLawAnnotation(userId, commentId, finalLawId, annotationIds)
    val userProfileRepository = new UserProfileRepository()
    val userName = userProfileRepository.getUserFullNameById(userId)
    userName
  }

  def getFinalLawAnnotationsForComment(commentId:Long, finalLawId:Long):List[FinalLawUserAnnotation] = {
    val finalLawUserAnnotation = consultationRepository.getFinalLawAnnotationsForComment(commentId, finalLawId)
    finalLawUserAnnotation
  }

  def howManyLikesToday(user_id:UUID): Int ={
    val answer = commentsRepository.howManyLikesToday(user_id)
    answer
  }

  def getComments(consultationId:Long,
                   articleId:Long,
                   source: String,
                   discussionthreadid:Option[Int],
                   discussionthreadclientid:String,
                   user_id:Option[java.util.UUID]): List[Comment] = {

    val pageSize=10;
    var comments:List[Comment] = Nil

    if (source=="opengov"){
       comments =commentsRepository.getOpenGovComments(consultationId,articleId ,pageSize,user_id ).map{ c =>
         if (c.profileUrl.isDefined && c.profileUrl.get.startsWith("http://www.opengov.gr"))
           c.profileUrl = None // don't display the open gov comment url in the user's profile url //todo: this should be fixed in the crawler in the db
         c
       }
    }
    else {
      comments = commentsRepository.getComments(discussionthreadclientid, pageSize, user_id)
      //search comments to distinguish the ones that are comment replies
      for(comment <- comments) {
        //if the comment has a parentId, it is a reply
        if(comment.parentId.isDefined){
          //get the parentId of the comment
          val parentId = comment.parentId.get
          //get the parent comment
          val parentComment = getCommentById(comments, parentId).asInstanceOf[Comment]
          //append the reply to the list of replies of the parent comment
          parentComment.commentReplies = comment :: parentComment.commentReplies
          //exclude (delete) reply from list of comments (only parent comments or comments with no replies should be in this list)
          comments = comments.filterNot(element => element == comment)
        }
      }
    }
    comments
  }


  /** Function which returns the comment from a list of comments by comment id
    *
    * @param comments the list od comments
    * @param id id of the comment we want
    */
  def getCommentById(comments:List[Comment], id:Long):Any = {
    var commentFound:Any = Nil
    for(comment <- comments) {
      if(comment.id.get == id) {
        commentFound = comment
      }
    }
    commentFound
  }


}