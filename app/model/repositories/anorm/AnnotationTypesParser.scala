package model.repositories.anorm

import java.util.Date

import anorm.SqlParser._
import anorm._

import model.dtos._

object AnnotationTypesParser {

  val Parse: RowParser[AnnotationTags] = {
    get[Long]("id") ~
      get[String]("description") ~
      get[Int]("type_id") map
      {
        case id ~ description ~ type_id =>
          AnnotationTags(id, description, type_id)

      }
  }
}