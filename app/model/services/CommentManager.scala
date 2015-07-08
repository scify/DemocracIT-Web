package model.services

import java.util
import java.util.Date

import model.dtos.{PlatformStats, _}
import model.repositories._
import model.viewmodels._
import org.scify.democracit.solr.DitSorlQuery


class CommentManager {

  private val commentsPageSize = 50

  def saveComment(comment:Comment): Comment = {
    val commentsRepository = new CommentsRepository()

    if (!comment.discussionThread.get.id.isDefined || comment.discussionThread.get.id.get <=0 )
        comment.discussionThread.get.id = commentsRepository.saveDiscussionThread(comment.discussionThread.get.clientId, comment.discussionThread.get.text)

    comment.id= Some(commentsRepository.saveComment(comment, comment.discussionThread.get.id.get).get)

    comment
  }

  def getComments(consultationId:Long,
                   articleId:Long,
                   source: String,
                   discussionthreadid:Option[Int],
                   discussionthreadclientid:String): List[Comment] = {

    val commentsRepository = new CommentsRepository()
    val pageSize=10;
    var comments:List[Comment] = Nil

    if (source=="opengov")
       comments =commentsRepository.getOpenGovComments(consultationId,articleId ,pageSize )
    else
      comments =commentsRepository.getComments(discussionthreadclientid,pageSize)

    comments
  }
}