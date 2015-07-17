package model.repositories

import java.util.{UUID, Date}
import _root_.anorm.{TypeDoesNotMatch, ToStatement, Column, SqlParser}
import anorm._
import model.dtos.CommentSource.CommentSource
import model.dtos._
import repositories.anorm._
import org.joda.time.DateTime
import play.api.db.DB
import play.api.Play.current
import repositories.anorm.{ArticleParser, ConsultationParser}


class CommentsRepository {

  def getComments(discussionthreadclientid:String,
                  pageSize:Int):List[Comment]  = {
    DB.withConnection { implicit c =>

      //It seems that None is not replaced correctly with Null by anorm
      // use a magic number... http://stackoverflow.com/questions/26798371/anorm-play-scala-and-postgresql-dynamic-sql-clause-not-working
      //      val paramMaxCommentId:Long = maxCommentId.getOrElse(-9999)

      //todo: get the user fields when login/register related tasks are completed
      //currently we allow only one annotation tag per comment ( public.annotation_items  contains maximum one annotation per comment)
     SQL"""
           select c.*, CAST(c.user_id  AS varchar) as fullName,
                  ant.id as annotationTypeId,
                  ant.description as annotationTypeDescr
              from public.comments c
                                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                    left outer join public.users u on u.id = c.user_id
                                    left outer join public.annotation_items i on i.public_comment_id = c.id
                           		      left outer join public.annotation_types_lkp ant on ant.id = i.annotation_type_id
            where t.tagid =$discussionthreadclientid
            order by c.date_added desc, c.id desc
        """.as {
                  (CommentsParser.Parse ~ AnnotationTypesParser.Parse map {
                    tuple => {
                      tuple._1.annotationTags =  if (tuple._2.isDefined) List(tuple._2.get) else Nil
                      tuple._1
                    }
                  }) *
               }
    }
  }


  def getOpenGovComments(consultationId:Long,
                         articleId:Long,pageSize:Int
                   ):List[Comment]  = {
    DB.withConnection { implicit c =>

      //todo: add paging
       SQL"""
          select c.*, o.fullname  from public.comments c
              left outer join public.comment_opengov o on o.id =c.id
              where c.article_id = $articleId
              and  c.source_type_id= 2
              order by c.date_added desc, c.id desc
        """.as(CommentsParser.Parse *)
    }
  }

    private def getDiscussionThreadId(discussionThreadTagId:String):Long = {
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

        if (result.asInstanceOf[Option[Long]].isDefined)
            result
        else
        {
         val id=  SQL"""
             select id from public.discussion_thread t where t.tagid = $discussionThreadTagId
                """.as(SqlParser.long("id").single)

          Some(id)
        }
      }
    }

  def loadDiscussionThreadsWithCommentsCount(consultationId:Long): Seq[DiscussionThread] =
  {
    DB.withConnection { implicit c =>
      SQL"""
              select t.id,t.tagid, count(*) as numberOfComments from public.comments c
                inner join public.articles a on a.id = c.article_id
                inner join public.discussion_thread t on t.id = c.discussion_thread_id
                where a.consultation_id = $consultationId
              group by t.id,t.tagid
              """.as(DiscussionThreadWithCommentsCountParser.Parse *)
    }
  }

  def loadAnnotationTags():Seq[AnnotationTags] = {

    DB.withConnection { implicit c =>

      val sql = SQL("select * from public.annotation_types_lkp")

      sql().map( row =>
                    AnnotationTags(row[Int]("id"),row[String]("description"))
                ).toList

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
          if (annotation.id>0)
            {
                SQL"""
                      INSERT INTO public.annotation_items
                                  (public_comment_id,annotation_type_id)
                      VALUES
                      ($commentId,${annotation.id})
                    """.execute()
            }

        }

        commentId
      }
    }


}
