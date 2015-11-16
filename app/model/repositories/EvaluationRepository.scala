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
          SQL"""
                with dates as (
                    select extract(year from now()) -1 || '/01' as date union
                    select extract(year from now()) -1 || '/02' as date union
                    select extract(year from now()) -1 || '/03' as date union
                    select extract(year from now()) -1 || '/04' as date union
                    select extract(year from now()) -1 || '/05' as date union
                    select extract(year from now()) -1 || '/06' as date union
                    select extract(year from now()) -1 || '/07' as date union
                    select extract(year from now()) -1 || '/08' as date union
                    select extract(year from now()) -1 || '/09' as date union
                    select extract(year from now()) -1 || '/10' as date union
                    select extract(year from now()) -1 || '/11' as date union
                    select extract(year from now()) -1 || '/12' as date union

                    select extract(year from now()) || '/01' as date union
                    select extract(year from now()) || '/02' as date union
                    select extract(year from now()) || '/03' as date union
                    select extract(year from now()) || '/04' as date union
                    select extract(year from now()) || '/05' as date union
                    select extract(year from now()) || '/06' as date union
                    select extract(year from now()) || '/07' as date union
                    select extract(year from now()) || '/08' as date union
                    select extract(year from now()) || '/09' as date union
                    select extract(year from now()) || '/10' as date union
                    select extract(year from now()) || '/11' as date union
                    select extract(year from now()) || '/12' as date
                )
                select d.date, sum(case when c.id is null then 0 else 1 end) as numberOfConsultations from dates d
                  left outer join consultation c on to_char(start_date, 'YYYY/MM') = d.date
                group by d.date
                order by d.date

             """.as(ConsultationsPerMonthParser.Parse *)

        consultationsPerMonth
      }
    }



}
