package model.repositories

import java.util.Date
import _root_.anorm.SqlParser
import anorm._
import anorm.SqlParser._
import model.dtos.CommentSource.CommentSource
import model.dtos._
import repositories.anorm._
import org.joda.time.DateTime
import play.api.db.DB
import play.api.Play.current
import repositories.anorm.{ArticleParser, ConsultationParser}


class CommentsRepository {

  def getComments(consultationId:Int,
                  articleId:Int,
                  discussionThreadId:Option[Int],
                  source: CommentSource,
                  maxCommentId:Option[Long],
                  pageSize:Int
                   ):List[Comment]  = {
    DB.withConnection { implicit c =>

      //It seems that None is not replaced correctly with Null by anorm
      // use a magic number... http://stackoverflow.com/questions/26798371/anorm-play-scala-and-postgresql-dynamic-sql-clause-not-working
      val paramDiscussionThread:Int = discussionThreadId.getOrElse(-9999)
      val paramMaxCommentId:Long = maxCommentId.getOrElse(-9999)

       SQL"""
          select c.*, o.fullname  from public.comments c
              left outer join public.comment_opengov o on o.id =c.id
              where c.article_id = $articleId
              and  (discussion_thread_id = $paramDiscussionThread or $paramDiscussionThread = -9999)
              and  c.source_type_id= ${source.id}
              and  (c.id < $paramMaxCommentId or $paramMaxCommentId =-9999)
              limit $pageSize
        """.as(CommentsParser.Parse *)
    }
  }

}
