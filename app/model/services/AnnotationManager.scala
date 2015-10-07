package model.services

import java.util
import java.util.Date

import model.dtos.{PlatformStats, _}
import model.repositories._
import model.viewmodels._
import org.scify.democracit.solr.DitSorlQuery


class AnnotationManager {

  private val commentsPageSize = 50
  val commentsRepository = new CommentsRepository()

  def extractTags(input:String):Seq[String] = {
    //todo: Integrate with paulopoulos library
    "extracted-topic-from-paulopoulos"::Nil
  }

  def saveComment(comment:Comment): Comment = {

    if (!comment.discussionThread.get.id.isDefined || comment.discussionThread.get.id.get <=0 )
        comment.discussionThread.get.id = commentsRepository.saveDiscussionThread(comment.discussionThread.get.clientId, comment.discussionThread.get.text)

    comment.id= Some(commentsRepository.saveComment(comment, comment.discussionThread.get.id.get).get)

    comment
  }

  def rateComment(user_id:java.util.UUID, comment_id:Long, liked:Option[Boolean]) = {
    commentsRepository.rateComment(user_id,comment_id,liked)
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
    else
      comments =commentsRepository.getComments(discussionthreadclientid,pageSize,user_id)

    comments
  }
}