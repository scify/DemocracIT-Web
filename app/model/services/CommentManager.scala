package model.services

import java.util
import java.util.Date

import model.dtos.{PlatformStats, _}
import model.repositories._
import model.viewmodels._
import org.scify.democracit.solr.DitSorlQuery


class CommentManager {

  private val commentsPageSize = 50

  def saveComment(comment:Comment,annotationIdentifier:String,discussionRoomText:String): Comment = {
    val commentsRepository = new CommentsRepository()
    var discussionThreadId:Option[Long] = None;
    if (comment.discussionThread.isEmpty)
        discussionThreadId =commentsRepository.saveDiscussionThread(annotationIdentifier,discussionRoomText)

    if (discussionThreadId.isEmpty)
      discussionThreadId =Some(commentsRepository.getDiscussionThreadId(annotationIdentifier))

    comment.id= commentsRepository.saveComment(comment,discussionThreadId.get).get
    comment
  }

  def getOpenGovComments(consultationId:Long,articleId:Long, maxCommentId:Option[Long]): List[Comment] = {

    val commentsRepository = new CommentsRepository()
    commentsRepository.getComments(consultationId,articleId,None,CommentSource.OpenGov,maxCommentId,commentsPageSize )
  }
}