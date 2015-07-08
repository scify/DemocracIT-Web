package utils

import java.util.UUID

import anorm.{TypeDoesNotMatch, Column, ToStatement}
import model.dtos.CommentSource._
import model.dtos.{AnnotationTags, DiscussionThread}
import play.api.data.FormError
import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._

object ImplicitAnormHelperMethods {

  /**
   * Implicit conversion from UUID to Anorm statement value
   */
  implicit def uuidToStatement = new ToStatement[UUID] {
    def set(s: java.sql.PreparedStatement, index: Int, aValue: UUID): Unit = s.setObject(index, aValue)
  }

  /**
   * Implicit conversion from Anorm row to UUID
   */
  implicit def rowToUUID: Column[UUID] = {
    Column.nonNull[UUID] { (value, meta) =>
      value match {
        case v: UUID => Right(v)
        case _ => Left(TypeDoesNotMatch(s"Cannot convert $value:${value.asInstanceOf[AnyRef].getClass} to UUID for column ${meta.column}"))
      }
    }
  }

}

