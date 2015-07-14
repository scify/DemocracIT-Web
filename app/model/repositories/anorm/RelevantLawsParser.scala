package repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._

/**
 * Created by pisaris on 9/7/2015.
 */
object RelevantLawsParser {
  val Parse: RowParser[RelevantLaws] = {

      long("id") ~
      int("article_id") ~
      str("url_pdf") ~
      str("entity_type") ~
      str("entity_text") ~
      long("consultation_id") map
      {
        case id ~ article_id ~ pdf_url ~ entity_type ~ entity_text ~ consultation_id =>
          new RelevantLaws(id, article_id, pdf_url, entity_type, entity_text, consultation_id)
      }

  }
}
