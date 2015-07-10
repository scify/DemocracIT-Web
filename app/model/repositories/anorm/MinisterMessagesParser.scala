package repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._

/**
 * Created by pisaris on 9/7/2015.
 */
object MinisterMessagesParser {
  val Parse: RowParser[MinisterMessage] = {

    long("consultation_id") ~
      str("message") ~
      date("date_added")map
      {
        case consultation_id ~ message ~ date_added  =>
          new MinisterMessage(consultation_id, message, date_added)
      }

  }
}
