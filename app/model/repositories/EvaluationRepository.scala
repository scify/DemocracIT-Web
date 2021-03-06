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
                      select d.date, sum(case when c.id is null then 0 else 1 end) as numberOfConsultations, array_to_string(array_agg(c.id), ', ') as cons_ids
                                    from dates d
                                    left outer join consultation c on to_char(start_date, 'YYYY/MM') = d.date
                                    group by d.date
                                    order by d.date
                  """).as(ConsultationsPerMonthParser.Parse *)
        consultationsPerMonth
      }
    }

  def getConsultations(cons_ids: String): List[ConsultationForEvaluation] = {
    DB.withConnection { implicit c =>

      val consultations: List[ConsultationForEvaluation] =
        SQL(
          """select * from consultation where id in (""" + cons_ids + """) order by start_date desc
          """).as(ConsultationForEvaluationParser.Parse *)
      consultations
    }
  }

  def getConsultationFinalLawStats():List[ConsultationFinalLawStats] = {
    DB.withTransaction() { implicit c =>
      val results:List[ConsultationFinalLawStats] = SQL"""select coalesce(cast(active as int), 0) as hasLaw,
                                                    count(*) as numOfConsultations,  array_to_string(array_agg(cons.id), ', ') as cons_ids
                                    from consultation cons
                                    left outer join consultation_final_law cfl on cfl.consultation_id = cons.id  and active = cast(1 as bit)
                                    group by active

        """.as(ConsultationFinalLawStatsParser.Parse *)
      results
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

            select d.date, o.title as organizationName, d.id as organizationId, sum(case when c.id is null then 0 else 1 end) as numberOfConsultations, o.group_title as groupTitle, array_to_string(array_agg(c.id), ', ') as cons_ids
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
                                  SELECT date_part('day', end_date - start_date) AS ConsultationPeriod, consultation.id,
              			    organization_id
                                  FROM consultation
                               ),
                               GroupedConsultations AS(
                                    SELECT CASE
                                            WHEN ConsultationPeriod<=5
                                                 THEN 'LESS_THAN_5'
                                            WHEN (ConsultationPeriod>5 and ConsultationPeriod<=10)
                                                 THEN '6_TO_10'
                                            WHEN (ConsultationPeriod>10 and ConsultationPeriod<=15)
                                                 THEN '11_TO_15'
                                            WHEN (ConsultationPeriod>15 and ConsultationPeriod<=20)
                                                 THEN '16_TO_20'
                                            WHEN (ConsultationPeriod>20 and ConsultationPeriod<=30)
                                                 THEN '21_TO_30'
                          		  WHEN (ConsultationPeriod>30 and ConsultationPeriod<=50)
                                                 THEN '31_TO_50'
                          		  WHEN (ConsultationPeriod>50)
                                                 THEN 'MORE_THAN_50'
                                            END AS Periods,
                                            organization_id, id
                                            FROM ConsultationTimes
                               ),
                               Periods as (
              			select 'LESS_THAN_5' as Periods, 1 as orderid union
              			select '6_TO_10'  as Periods, 2 as orderid union
              			select '11_TO_15' as Periods, 3 as orderid union
              			select '16_TO_20' as Periods, 4 as orderid union
              			select '21_TO_30'  as Periods, 5 as orderid union
              			select '31_TO_50' as Periods, 6 as orderid union
              			select 'MORE_THAN_50' as Periods,7 as orderid
                               ),
                               Dimentions as (
                               select Periods.Periods,id, orderid, organization_lkp.title, organization_lkp.group_title
              			from Periods
              			cross join organization_lkp
                               )
                               select d.id as organizationId, d.Periods as periods,  sum(case when g.organization_id is null then 0 else 1 end) as numberOfConsultations ,
              			d.title as organizationName, d.group_title as groupTitle, array_to_string(array_agg(g.id), ', ') as cons_ids
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

                      SELECT date_part('day', end_date - start_date) AS ConsultationPeriod, consultation.id
                      FROM consultation
                      INNER JOIN organization_lkp ON consultation.organization_id = organization_lkp.id
                   ),

                   GroupedConsultations AS(
                        SELECT CASE
                                WHEN ConsultationPeriod<=5
                                     THEN 'LESS_THAN_5'
                                WHEN (ConsultationPeriod>5 and ConsultationPeriod<=10)
                                     THEN '6_TO_10'
                                WHEN (ConsultationPeriod>10 and ConsultationPeriod<=15)
                                     THEN '11_TO_15'
                                WHEN (ConsultationPeriod>15 and ConsultationPeriod<=20)
                                     THEN '16_TO_20'
                                WHEN (ConsultationPeriod>20 and ConsultationPeriod<=30)
                                     THEN '21_TO_30'
              		  WHEN (ConsultationPeriod>30 and ConsultationPeriod<=50)
                                     THEN '31_TO_50'
              		  WHEN (ConsultationPeriod>50)
                                     THEN 'MORE_THAN_50'
                                END AS Periods,
                                *
                                FROM ConsultationTimes
                   )

              SELECT
                     Periods,
                     COUNT(*) AS numberOfConsultations,
                     round(100.0 *  COUNT(*) / sum(COUNT(*)) over (),1) as percentage, array_to_string(array_agg(GroupedConsultations.id), ', ') as cons_ids
                     FROM   GroupedConsultations
                     GROUP BY
                              Periods
                     ORDER BY
                              CASE Periods WHEN 'LESS_THAN_5'  THEN 1
                                           WHEN '6_TO_10'      THEN 2
                                           WHEN '11_TO_15'     THEN 3
                                           WHEN '16_TO_20'     THEN 4
                                           WHEN '21_TO_30' 		 THEN 5
                                           WHEN '31_TO_50' 		 THEN 6
                                           WHEN 'MORE_THAN_50' THEN 7
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
                        SELECT consultation.id, consultation.organization_id as organizationId, count (*) AS numberOfComments
                        FROM consultation
                        INNER JOIN articles art ON consultation.id = art.consultation_id
                        inner join comments comm on art.id = comm.article_id
                        group by consultation.id
                        order by organization_id
                        ),
                        GroupedConsultations AS(
                          SELECT CASE
                                  WHEN numberOfComments<=20
                                       THEN 'COMMENTS_LESS_THAN_20'
                                  WHEN (numberOfComments>20 and numberOfComments<=50)
                                       THEN 'COMMENTS_21_TO_50'
                                  WHEN (numberOfComments>50 and numberOfComments<=100)
                                       THEN 'COMMENTS_51_TO_100'
                                  WHEN (numberOfComments>100 and numberOfComments<=200)
                                       THEN 'COMMENTS_101_TO_200'
                                  WHEN (numberOfComments>200 and numberOfComments<=500)
                                       THEN 'COMMENTS_201_TO_500'
                                  WHEN (numberOfComments>500 and numberOfComments<=800)
                                       THEN 'COMMENTS_501_TO_800'
                                  WHEN (numberOfComments>800)
                                       THEN 'COMMENTS_MORE_THAN_800'
                                  END AS CommentWindow,
                                  *
                                  FROM ConsultationComments
                        ),
                        CommentWindow as (
                            select 'COMMENTS_LESS_THAN_20' as CommentWindow ,1 as orderid union
                            select 'COMMENTS_21_TO_50'  as CommentWindow, 2 as orderid union
                            select 'COMMENTS_51_TO_100' as CommentWindow, 3 as orderid union
                            select 'COMMENTS_101_TO_200' as CommentWindow, 4 as orderid union
                            select 'COMMENTS_201_TO_500'  as CommentWindow, 5 as orderid union
                            select 'COMMENTS_501_TO_800' as CommentWindow, 6 as orderid union
                            select 'COMMENTS_MORE_THAN_800' as CommentWindow,7 as orderid),
                                       Dimentions as (
                                       select CommentWindow.CommentWindow,id, orderid, organization_lkp.title, organization_lkp.group_title
                            from CommentWindow
                            cross join organization_lkp )

                              SELECT  d.id AS organizationId,
                                      d.title AS organizationName,
                                      sum(case when organizationId is null then 0 else 1 end) AS numberOfConsultations,
                                      d.group_title AS groupTitle, d.CommentWindow, array_to_string(array_agg(g.id), ', ') as cons_ids
                                      from Dimentions d
                                      left outer join  GroupedConsultations g on d.CommentWindow = g.CommentWindow and d.id = g.organizationId
                                      group by d.CommentWindow, d.id, d.orderid, d.title, d.group_title
                                      order by d.id, d.orderid
            """).as(CommPerConsPerOrganizationParser.Parse *)
      commPerConsPerOrganization
    }
  }

}
