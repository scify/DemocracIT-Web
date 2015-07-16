package repositories.anorm

import java.text.SimpleDateFormat

import anorm._
import anorm.SqlParser._
import model.dtos._


object ConsultationParser{

  val Parse: RowParser[Consultation] = {

    long("id") ~
      date("start_date") ~
      date("end_date") ~
      str("title") ~
      str("short_description") ~
      int("organization_id") ~
      str("consultation_url") ~
      str("OrganizationTitle") ~
      get[Option[String]]("report_text") ~
      get[Option[String]]("report_url") ~
      get[Option[String]]("completed_text") ~
      int("num_of_articles") map
      {
        case id ~ start_date ~ end_date ~ title ~ short_description ~
             organization_id ~ consultation_url ~ organization_title ~ report_text ~ report_url ~ completed_text ~
             num_of_articles =>

          new Consultation(
            id, start_date,end_date, title, short_description,
            new Organization(organization_id,organization_title),
            -1,
            report_text,report_url, completed_text, num_of_articles,consultation_url,Nil
          )
      }

  }
}
