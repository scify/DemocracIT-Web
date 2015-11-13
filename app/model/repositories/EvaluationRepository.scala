package model.repositories

import _root_.anorm._
import model.dtos.ConsultationsPerMonth
import model.repositories.anorm.ConsultationsPerMonthParser
import play.api.Play.current
import play.api.db.DB

class EvaluationRepository {

    def getConsultationCommentsPerMonth(): List[ConsultationsPerMonth] = {
      DB.withConnection { implicit c =>
        val consultationsPerMonth: List[ConsultationsPerMonth] =
          SQL""" """.as(ConsultationsPerMonthParser.Parse *)

        consultationsPerMonth
      }
    }



}
