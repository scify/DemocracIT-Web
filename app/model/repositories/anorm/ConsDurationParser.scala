package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsDurationParser{

  val Parse: RowParser[ConsDurations] = {

      str("periods") ~
      int("numberOfConsultations")~
        double("percentage") map
      {
        case periods ~ numberOfConsultations ~ percentage =>
          new ConsDurations(periods, numberOfConsultations, percentage)
      }

  }
}
