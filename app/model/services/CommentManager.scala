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
    var discussionThreadId: Option[Long] = if (comment.discussionThread.get.id >0)
                                                  Some(comment.discussionThread.get.id ) else  None
    if (discussionThreadId.isEmpty)  {//if not discussion thread is assigned to the comment save or retrieve from database
      discussionThreadId = commentsRepository.saveDiscussionThread(comment.discussionThread.get.discussionThreadClientId, comment.discussionThread.get.text)
      comment.discussionThread.get.id = discussionThreadId.get
    }

    if (discussionThreadId.isEmpty){ //saveDiscussionThread returns the id only if its saved. we need the id.
      //todo: move the getDiscussionThreadId inside the saveDiscussionThread method
      discussionThreadId = Some(commentsRepository.getDiscussionThreadId(comment.discussionThread.get.discussionThreadClientId))
      comment.discussionThread.get.id = discussionThreadId.get
    }

    comment.id= commentsRepository.saveComment(comment,discussionThreadId.get).get

    comment
  }

  def getOpenGovComments(consultationId:Long,articleId:Long, maxCommentId:Option[Long]): List[Comment] = {

    val commentsRepository = new CommentsRepository()
    commentsRepository.getComments(consultationId,articleId,None,CommentSource.OpenGov,maxCommentId,commentsPageSize )
  }
}