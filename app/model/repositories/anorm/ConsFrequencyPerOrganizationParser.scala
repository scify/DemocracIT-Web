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
      str("groupTitle") map
      {
        case date ~ organizationName ~ organizationId ~ numberOfConsultations ~ groupTitle =>
          new ConsFrequencyPerOrganization(date, organizationName, organizationId, numberOfConsultations, groupTitle)
      }

  }
}
