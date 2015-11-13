package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsultationsPerMonthParser{

  val Parse: RowParser[ConsultationsPerMonth] = {

    str("date") ~
    int("numberOfConsultations")map
      {
        case date ~ numberOfConsultations=>
          new ConsultationsPerMonth(date, numberOfConsultations)
      }

  }
}
