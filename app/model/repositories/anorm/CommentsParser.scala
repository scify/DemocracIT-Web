package repositories.anorm

import java.util.Date

import anorm.SqlParser._
import anorm._

import model.dtos._

object AnnotationTypesParser {

  val Parse: RowParser[Option[AnnotationTags]] = {
    get[Option[Int]]("annotationTypeId") ~
    get[Option[String]]("annotationTypeDescr")  map
    {
      case annotationTypeId ~ annotationTypeDescr =>
        if (annotationTypeId.isDefined)
          Some(AnnotationTags(annotationTypeId.get, annotationTypeDescr.get))
        else
          None
    }
  }
}
object CommentsParser{

  val Parse: RowParser[Comment] = {


    long("id") ~
    int("article_id") ~
    get[Option[Int]]("parent_id") ~
    str("comment") ~
    int("source_type_id") ~
    get[Option[Long]]("discussion_thread_id") ~
    get[Option[java.util.UUID]]("user_id") ~
    str("fullname") ~
    get[Date]("date_added") ~
    int("revision") ~
    str("depth") ~
    get[Option[String]]("annotatedText")   map
      {
        case id ~  article_id ~ parent_id ~ comment ~ source_type_id ~ discussion_thread_id ~
             user_id ~ full_name ~ date_added ~ revision ~depth ~ annotatedText  =>

          val discussionThread = if (discussion_thread_id.isDefined) Some(DiscussionThread(discussion_thread_id,"","",None)) else None
          new Comment(Some(id),
                      article_id,
                      if (source_type_id==1) CommentSource.Democracit else  CommentSource.OpenGov,
                      comment,
                      annotatedText,
                      user_id,
                      full_name,
                      date_added,
                      revision,
                      depth,
                      Nil,
                      discussionThread
                      )
      }

  }
}
