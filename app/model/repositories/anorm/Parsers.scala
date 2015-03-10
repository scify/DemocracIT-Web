package repositories.anorm

import anorm.RowParser
import democracit.dtos.{Organization, Consultation}


object Parsers {
  val consultationParser: RowParser[Consultation] = {
    import anorm.~
    import anorm.SqlParser._

    int("id") ~
    date("start_date") ~
    date("end_date") ~
    str("title") ~
    str("short_description") ~
    int("organization_id") ~
    str("organization_title") ~
    str("report_text") ~
    int("num_of_articles") map
      {
        case id ~ start_date ~ end_date ~ title ~ short_description ~
             organization_id ~ organization_title ~ report_text ~
             num_of_articles =>

          new Consultation(
            id, start_date,end_date, title, short_description,
            new Organization(organization_id,organization_title),
            -1,
            report_text, num_of_articles,null
          )
      }




  }
}
