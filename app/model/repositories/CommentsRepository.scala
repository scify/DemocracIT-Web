package model.repositories

import java.util.{UUID, Date}
import _root_.anorm.{TypeDoesNotMatch, ToStatement, Column, SqlParser}
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

    def getDiscussionThreadId(discussionThreadTagId:String):Long = {
      DB.withConnection { implicit c =>
        SQL"""
           select id from public.discussion_thread t where t.tagid = $discussionThreadTagId
              """.as(SqlParser.long("id").single)

      }
    }

    /* Saves a discussion thread only if does not exist already.
    * In case a new discussion thread is created then the id is returned
    * */
    def saveDiscussionThread(discussionThreadTagId:String,discussionThreadWholeText:String): Option[Long] =
    {
      DB.withConnection { implicit c =>
        val result = SQL"""
           insert into public.discussion_thread (tagid,relatedText)
            select $discussionThreadTagId,$discussionThreadWholeText
            where not exists (select 1 from public.discussion_thread where tagid = $discussionThreadTagId)
              """.executeInsert()

        result

      }
    }



    def saveComment(comment: Comment, discussionThreadId: Long): Option[Long] ={
      DB.withTransaction() { implicit c =>

       import utils.ImplicitAnormHelperMethods._

       val commentId = SQL"""
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
                      depth,
                      annotatedtext)
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
                      ${comment.depth},
                      ${comment.userAnnotatedText})
                  """.executeInsert()

        for (annotation <- comment.annotationTags)
        {
          SQL"""
          INSERT INTO public.annotation_items
                      (public_comment_id,annotation_type_id)
          VALUES
                    ($commentId,${annotation.id})
                  """.execute()
        }

        commentId
      }
    }


}
