package model.repositories.anorm

import java.util.UUID

import anorm.SqlParser._
import anorm._
import model.dtos._

object FinalLawAnnotationParser {

  val Parse: RowParser[FinalLawUserAnnotation] = {
    get[UUID]("user_id") ~
    get[String]("user_name") ~
    get[Long]("comment_id") map
    {
      case user_id ~ user_name ~ comment_id =>
        FinalLawUserAnnotation(user_id, user_name, comment_id, Nil)
    }
  }
}