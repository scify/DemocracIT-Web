package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._

object ConsultationFinalLawStatsParser {
  val Parse: RowParser[ConsultationFinalLawStats] = {

      int("numOfConsultations") ~ int("hasLaw") ~ str("cons_ids")map
      {
        case numOfConsultations ~ hasLaw ~ cons_ids =>
          ConsultationFinalLawStats(numOfConsultations, hasLaw, cons_ids)
      }
  }
}
