package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._

object ConsultationFinalLawStatsParser {
  val Parse: RowParser[ConsultationFinalLawStats] = {

      int("numOfConsultations") ~ int("hasLaw")map
      {
        case numOfConsultations ~ hasLaw =>
          ConsultationFinalLawStats(numOfConsultations, hasLaw)
      }
  }
}
