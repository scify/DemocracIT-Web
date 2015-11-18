package model.repositories

import _root_.anorm._
import model.dtos.{ConsDurationsPerOrganization, ConsFrequencyPerOrganization, ConsultationsPerMonth}
import model.repositories.anorm.{ConsFrequencyPerOrganizationParser, ConsultationsPerMonthParser, ConsDurationPerOrganizationParser}
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

  def getConsDurationPerOrganization(): List[ConsDurationsPerOrganization] = {
    DB.withConnection { implicit c =>

      val consDurationPerMonth: List[ConsDurationsPerOrganization] =
        SQL("""

            WITH ConsultationTimes AS (

                    SELECT date_part('hour', end_date - start_date) AS ConsultationPeriod,
                           organization_lkp.title                   AS organizationName,
                           organization_lkp.id                      AS organizationId,
                           organization_lkp.group_title		          AS groupTitle
                    FROM consultation
                    INNER JOIN organization_lkp ON consultation.organization_id = organization_lkp.id
                 ),
                 GroupedConsultations AS(
                      SELECT CASE
                              WHEN ConsultationPeriod<=5
                                   THEN '5 και λιγότερες'
                              WHEN (ConsultationPeriod>5 and ConsultationPeriod<=10)
                                   THEN '6 έως 10'
                              WHEN (ConsultationPeriod>10 and ConsultationPeriod<=15)
                                   THEN '11 έως 15'
                              WHEN (ConsultationPeriod>15 and ConsultationPeriod<=20)
                                   THEN '16 έως 20'
                              WHEN (ConsultationPeriod>20 and ConsultationPeriod<=30)
                                   THEN '21 έως 30'
            		  WHEN (ConsultationPeriod>30 and ConsultationPeriod<=50)
                                   THEN '31 έως 50'
            		  WHEN (ConsultationPeriod>50)
                                   THEN '50 και περισσότερες'
                              END AS Periods,
                              *
                              FROM ConsultationTimes
                 )

            SELECT organizationId,
                   organizationName,
                   Periods,
                   COUNT(*) AS numberOfConsultations,
                   groupTitle
                   FROM   GroupedConsultations
                   GROUP BY organizationId,
                            organizationName,
                            Periods,
                            groupTitle
                   ORDER BY organizationId,
                            CASE Periods WHEN '5 και λιγότερες'     THEN 1
                                         WHEN '6 έως 10'            THEN 2
                                         WHEN '11 έως 15'           THEN 3
                                         WHEN '16 έως 20'           THEN 4
                                         WHEN '21 έως 30' 		THEN 5
                                         WHEN '31 έως 50' 		THEN 6
                                         WHEN '50 και περισσότερες' THEN 7
                            END
          """).as(ConsDurationPerOrganizationParser.Parse *)
      consDurationPerMonth
    }
  }

}
