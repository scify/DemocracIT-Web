package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsDurationParser{

  val Parse: RowParser[ConsDurations] = {

      str("periods") ~
      int("numberOfConsultations")~
        double("percentage") ~
        str("cons_ids") map
      {
        case periods ~ numberOfConsultations ~ percentage ~ cons_ids =>
          new ConsDurations(periods, numberOfConsultations, percentage, cons_ids)
      }

  }
}
