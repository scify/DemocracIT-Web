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

  def getOpenGovComments(consultationId:Long,articleId:Long, maxCommentId:Option[Long]): List[Comment] = {

    val commentsRepository = new CommentsRepository()
    commentsRepository.getComments(consultationId,articleId,None,CommentSource.OpenGov,maxCommentId,commentsPageSize )
  }
}