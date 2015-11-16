package model.repositories

import _root_.anorm._
import model.dtos.ConsultationsPerMonth
import model.repositories.anorm.ConsultationsPerMonthParser
import play.api.Play.current
import play.api.db.DB

class EvaluationRepository {

    def getConsultationCommentsPerMonth(dateSet: String): List[ConsultationsPerMonth] = {
      DB.withConnection { implicit c =>

        var query = "with dates as (" +
                    dateSet + " )"

        val consultationsPerMonth: List[ConsultationsPerMonth] =
          SQL(query +
                 """
                      select d.date, sum(case when c.id is null then 0 else 1 end) as numberOfConsultations from dates d
                                      left outer join consultation c on to_char(start_date, 'YYYY/MM') = d.date
                                    group by d.date
                                    order by d.date
                  """).as(ConsultationsPerMonthParser.Parse *)



        consultationsPerMonth
      }
    }



}
