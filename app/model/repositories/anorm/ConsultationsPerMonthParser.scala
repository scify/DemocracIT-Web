package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsultationsPerMonthParser{

  val Parse: RowParser[ConsultationsPerMonth] = {

    str("date") ~
    int("numberOfConsultations")~
    str("cons_ids")map
      {
        case date ~ numberOfConsultations ~cons_ids=>
          new ConsultationsPerMonth(date, numberOfConsultations,cons_ids)
      }

  }
}
