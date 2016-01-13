package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsFrequencyPerOrganizationParser{

  val Parse: RowParser[ConsFrequencyPerOrganization] = {

    str("date") ~
    str("organizationName") ~
    long("organizationId") ~
    int("numberOfConsultations") ~
      get[Option[String]]("groupTitle") ~
      str("cons_ids")map
      {
        case date ~ organizationName ~ organizationId ~ numberOfConsultations ~ groupTitle ~ cons_ids =>
          new ConsFrequencyPerOrganization(date, organizationName, organizationId, numberOfConsultations, groupTitle, cons_ids)
      }

  }
}
