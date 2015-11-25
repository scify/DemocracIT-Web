package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsultationForEvaluationParser{

  val Parse: RowParser[ConsultationForEvaluation] = {

      long("id") ~
      date("start_date")~
      date("end_date")~
      str("title")~
      str("short_description")~
      long("organization_id")~
      str("consultation_url")~
      int("completed")~
      int("num_of_articles")map
      {
        case id ~ start_date ~ end_date ~ title ~ short_description ~ organization_id ~ opengov_url ~ completed ~num_of_articles =>
          new ConsultationForEvaluation(id, start_date, end_date, title, short_description, organization_id, opengov_url, completed, num_of_articles)
      }

  }
}
