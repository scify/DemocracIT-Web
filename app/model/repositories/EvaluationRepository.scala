package model.repositories

import _root_.anorm._
import model.dtos._
import model.repositories.anorm._
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
        SQL("""WITH ConsultationTimes AS (
                                  SELECT date_part('hour', end_date - start_date) AS ConsultationPeriod,
              			    organization_id
                                  FROM consultation
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
                                            organization_id
                                            FROM ConsultationTimes
                               ),
                               Periods as (
              			select '5 και λιγότερες' as Periods ,1 as orderid union
              			select '6 έως 10'  as Periods, 2 as orderid union
              			select '11 έως 15' as Periods, 3 as orderid union
              			select '16 έως 20' as Periods, 4 as orderid union
              			select '21 έως 30'  as Periods, 5 as orderid union
              			select '31 έως 50' as Periods, 6 as orderid union
              			select '50 και περισσότερες' as Periods,7 as orderid
                               ),
                               Dimentions as (
                               select Periods.Periods,id, orderid, organization_lkp.title, organization_lkp.group_title
              			from Periods
              			cross join organization_lkp
                               )
                               select d.id as organizationId, d.Periods as periods,  sum(case when g.organization_id is null then 0 else 1 end) as numberOfConsultations ,
              			d.title as organizationName, d.group_title as groupTitle
              			from Dimentions d
              			left outer join  GroupedConsultations g on d.Periods = g.Periods and d.id = g.organization_id
              			group by d.Periods, d.id, d.orderid, d.title, d.group_title
              			order by d.id, d.orderid
          """).as(ConsDurationPerOrganizationParser.Parse *)
      consDurationPerMonth
    }
  }

  def getConsDuration(): List[ConsDurations] = {
    DB.withConnection { implicit c =>

      val consDurationPerMonth: List[ConsDurations] =
        SQL("""
              WITH ConsultationTimes AS (

                      SELECT date_part('hour', end_date - start_date) AS ConsultationPeriod
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

              SELECT
                     Periods,
                     COUNT(*) AS numberOfConsultations,
                     round(100.0 *  COUNT(*) / sum(COUNT(*)) over (),1) as percentage
                     FROM   GroupedConsultations
                     GROUP BY
                              Periods
                     ORDER BY
                              CASE Periods WHEN '5 και λιγότερες'     THEN 1
                                           WHEN '6 έως 10'            THEN 2
                                           WHEN '11 έως 15'           THEN 3
                                           WHEN '16 έως 20'           THEN 4
                                           WHEN '21 έως 30' 		THEN 5
                                           WHEN '31 έως 50' 		THEN 6
                                           WHEN '50 και περισσότερες' THEN 7
                              END
            """).as(ConsDurationParser.Parse *)
      consDurationPerMonth
    }
  }

  def getCommPerConsPerOrganization(): List[CommPerConsPerOrganization] = {
    DB.withConnection { implicit c =>

      val commPerConsPerOrganization: List[CommPerConsPerOrganization] =
        SQL("""
              WITH ConsultationComments AS (
                      SELECT consultation.id, count (*) AS numberOfComments,
              		organization_lkp.title                   AS organizationName,
              		organization_lkp.id                      AS organizationId,
              		organization_lkp.group_title		AS groupTitle
                      FROM consultation
                      INNER JOIN articles art ON consultation.id = art.consultation_id
                      inner join comments comm on art.id = comm.article_id
                      INNER JOIN organization_lkp ON consultation.organization_id = organization_lkp.id
                      group by organizationId, consultation.id
                      ),
                      GroupedConsultations AS(
                        SELECT CASE
                                WHEN numberOfComments<=20
                                     THEN '20 και λιγότερα'
                                WHEN (numberOfComments>20 and numberOfComments<=50)
                                     THEN '21 έως 50'
                                WHEN (numberOfComments>50 and numberOfComments<=100)
                                     THEN '51 έως 100'
                                WHEN (numberOfComments>100 and numberOfComments<=200)
                                     THEN '101 έως 200'
                                WHEN (numberOfComments>200 and numberOfComments<=500)
                                     THEN '201 έως 500'
              		  WHEN (numberOfComments>500 and numberOfComments<=800)
                                     THEN '501 έως 800'
              		  WHEN (numberOfComments>800)
                                     THEN '801 και περισσότερα'
                                END AS CommentWindow,
                                *
                                FROM ConsultationComments
              	)

              	SELECT organizationId,
              	       organizationName,
              	       CommentWindow,
              	       COUNT(*) AS numberOfConsultations,
              	       groupTitle
              	       FROM   GroupedConsultations
              	       GROUP BY organizationId,
              			organizationName,
              			CommentWindow,
              			groupTitle
              	       ORDER BY organizationId,
              			CASE CommentWindow WHEN '20 και λιγότερα'     THEN 1
              				     WHEN '21 έως 50'           THEN 2
              				     WHEN '51 έως 100'          THEN 3
              				     WHEN '101 έως 200'         THEN 4
              				     WHEN '201 έως 500' 	THEN 5
              				     WHEN '501 έως 800' 	THEN 6
              				     WHEN '801 και περισσότερα' THEN 7
              			END

            """).as(CommPerConsPerOrganizationParser.Parse *)
      commPerConsPerOrganization
    }
  }

}
