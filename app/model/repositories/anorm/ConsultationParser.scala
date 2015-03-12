package repositories.anorm

import anorm._
import anorm.SqlParser._
import democracit.dtos._


object ConsultationParser{

  val Parse: RowParser[Consultation] = {

    long("id") ~
    date("start_date") ~
    date("end_date") ~
    str("title") ~
    str("short_description") ~
    int("organization_id") ~
    str("OrganizationTitle") ~
    get[Option[String]]("report_text") ~
    int("num_of_articles") map
      {
        case id ~ start_date ~ end_date ~ title ~ short_description ~
             organization_id ~ organization_title ~ report_text ~
             num_of_articles =>

          new Consultation(
            id, start_date,end_date, title, short_description,
            new Organization(organization_id,organization_title),
            -1,
            report_text, num_of_articles,Nil
          )
      }

  }
}
