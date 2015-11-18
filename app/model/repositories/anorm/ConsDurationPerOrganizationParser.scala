package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsDurationPerOrganizationParser{

  val Parse: RowParser[ConsDurationsPerOrganization] = {

      long("organizationId") ~
      str("organizationName") ~
      str("periods") ~
      int("numberOfConsultations")~
      str("groupTitle") map
      {
        case organizationId ~ organizationName ~ periods ~ numberOfConsultations ~ groupTitle =>
          new ConsDurationsPerOrganization(organizationId, organizationName, periods, numberOfConsultations, groupTitle)
      }

  }
}
