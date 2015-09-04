package model.repositories.anorm

import java.util.UUID

import anorm.SqlParser._
import anorm._
import model.dtos._

/**
 * Created by pisaris on 9/7/2015.
 */
object UserCommentsStatsParser {
  val Parse: RowParser[UserCommentStats] = {
    get[Option[UUID]]("user_id") ~ str("first_name") ~ str("last_name") ~ str("email") ~ str("role") ~ int("number_of_comments") map
      {
        case user_id ~ first_name ~ last_name ~ email ~ role ~ number_of_comments =>
          UserCommentStats(user_id, first_name, last_name, email, role, number_of_comments)
      }
  }

}
