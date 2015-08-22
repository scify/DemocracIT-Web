package model.repositories.anorm


import anorm.SqlParser._
import anorm._
import model.dtos._

/**
 * Created by pisaris on 9/7/2015.
 */
object AnnotationTagWithCommentsParser {
  val Parse: RowParser[AnnotationTagWithComments] = {

      long("id") ~ str("description") ~
      int("type_id") ~ int("comments_num")   map
      {
        case id ~ description ~ type_id ~ comments_num =>
          AnnotationTagWithComments(AnnotationTags(id,description,type_id),comments_num)
      }
  }
}
