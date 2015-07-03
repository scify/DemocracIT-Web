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

  def getComments(consultationId:Long,
                  articleId:Long,
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
              order by c.date_added desc, c.id desc
              limit $pageSize
        """.as(CommentsParser.Parse *)
    }
  }

    def getDiscussionThreadId(locationIdentifier:String):Long = {
      DB.withConnection { implicit c =>
        SQL"""
           select id from public.discussion_thread t where t.locationidentifier = $locationIdentifier
              """.as(SqlParser.long("id").single)

      }
    }

    def saveDiscussionThread(locationIdentifier:String,threadText:String): Option[Long] =
    {
      DB.withConnection { implicit c =>
        val result = SQL"""
           insert into public.discussion_thread (locationidentifier,text)
            select $locationIdentifier,$threadText
            where not exists (select 1 from public.discussion_thread where locationidentifier = $locationIdentifier)
              """.executeInsert()

        result

      }
    }

    def saveComment(comment: Comment, discussionThreadId: Long): Option[Long] ={
      DB.withConnection { implicit c =>

       val result = SQL"""
          INSERT INTO public.comments
                      (
                      url_source,
                      article_id,
                      parent_id,
                      "comment",
                      source_type_id,
                      discussion_thread_id,
                      user_id,
                      date_added,
                      revision,
                      depth)
          VALUES
                    (
                      NULL,
                      ${comment.articleId},
                      NULL,
                      ${comment.body},
                      1,
                      ${discussionThreadId},
                      ${comment.userId},
                      now(),
                      ${comment.revision},
                      ${comment.depth})
                  """.executeInsert()

        result
      }
    }


}
