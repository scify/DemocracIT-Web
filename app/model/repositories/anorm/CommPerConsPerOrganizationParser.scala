package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object CommPerConsPerOrganizationParser{

  val Parse: RowParser[CommPerConsPerOrganization] = {

    long("organizationId") ~
    str("organizationName") ~
    str("commentWindow") ~
    int("numberOfConsultations") ~
      str("groupTitle") map
      {
        case organizationId ~ organizationName ~ commentWindow ~ numberOfConsultations ~ groupTitle =>
          new CommPerConsPerOrganization(organizationId, organizationName, commentWindow, numberOfConsultations, groupTitle)
      }

  }
}
