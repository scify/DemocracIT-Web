package repositories.anorm

import java.util.Date

import anorm.SqlParser._
import anorm._

import model.dtos._

object CommentsParser{

  val Parse: RowParser[Comment] = {

    long("id") ~
    str("url_source") ~
    int("article_id") ~
    get[Option[Int]]("parent_id") ~
    str("comment") ~
    int("source_type_id") ~
    get[Option[Int]]("discussion_thread_id") ~
    get[Option[Int]]("user_id") ~
    str("fullname") ~
    get[Date]("date_added") ~
    int("revision") ~
    str("depth") map
      {
        case id ~ url_source ~ article_id ~ parent_id ~ comment ~ source_type_id ~ discussion_thread_id ~
             user_id ~ full_name ~ date_added ~ revision ~depth =>
          new Comment(id,
                      article_id,
                      if (source_type_id==1) CommentSource.Democracit else  CommentSource.OpenGov,
                      comment,
                      user_id.getOrElse(-1),
                      full_name,
                      date_added,
                      revision,depth,Nil,None)
      }

  }
}
