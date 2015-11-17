package model.repositories

import _root_.anorm._
import model.dtos.{ConsFrequencyPerOrganization, ConsultationsPerMonth}
import model.repositories.anorm.{ConsFrequencyPerOrganizationParser, ConsultationsPerMonthParser}
import play.api.Play.current
import play.api.db.DB

class EvaluationRepository {

    def getConsultationCommentsPerMonth(dateSet: String): List[ConsultationsPerMonth] = {
      DB.withConnection { implicit c =>

        val query = "with dates as (" +
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

  def getEvaluationPerOrganization(dateSet: String): List[ConsFrequencyPerOrganization] = {
    DB.withConnection { implicit c =>

      val query = "with dates as (" +
        dateSet + " )"

      val consFrequencyPerOrganization: List[ConsFrequencyPerOrganization] =
        SQL(query +
          """
            ,
            datesBYOrganization as
            (
              select dates.*, o.id from dates cross join organization_lkp  o
            )

            select d.date, o.title as organizationName, d.id as organizationId, sum(case when c.id is null then 0 else 1 end) as numberOfConsultations, o.group_title as groupTitle
              from datesBYOrganization d
            	  inner join organization_lkp o on d.id = o.id
            	  left outer join consultation c on to_char(start_date, 'YYYY/MM') = d.date and c.organization_id = o.id
            	group by d.date,d.id, o.title, o.group_title
            	order by d.id,d.date
          """).as(ConsFrequencyPerOrganizationParser.Parse *)
      consFrequencyPerOrganization
    }
  }

}
