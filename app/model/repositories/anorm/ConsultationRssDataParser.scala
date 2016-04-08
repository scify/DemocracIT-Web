package model.repositories.anorm

import java.util.Date

import anorm.SqlParser._
import anorm._
import model.dtos._

object ConsultationRssDataParser{

  val Parse: RowParser[ConsultationRssData] = {

      str("fullname") ~
      int("consultation_id") ~
      str("title") ~
      str("article_name") ~
      int("article_id") ~
      str("discussion_thread_tag_id") ~
      int("typeid") ~
      long("comment_id") ~
      get[Date]("date_added") ~
      str("relatedText") ~
      str("comment") map
      {
        case fullname ~  consultation_id ~ consultation_title ~ article_title ~ article_id ~
          discussionThreadTag ~ discussionThreadTypeId ~ comment_id ~
          comment_date ~ annotatedText ~ comment =>

          ConsultationRssData(fullname,consultation_id,consultation_title,article_title,article_id,
                              discussionThreadTag,discussionThreadTypeId,comment_id,
                              comment_date,annotatedText,comment)
      }
  }
}
