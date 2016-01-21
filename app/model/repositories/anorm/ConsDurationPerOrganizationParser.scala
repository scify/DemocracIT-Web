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
      get[Option[String]]("groupTitle")~
      str("cons_ids")map
      {
        case organizationId ~ organizationName ~ periods ~ numberOfConsultations ~ groupTitle ~ cons_ids =>
          new ConsDurationsPerOrganization(organizationId, organizationName, periods, numberOfConsultations, groupTitle, cons_ids)
      }

  }
}
