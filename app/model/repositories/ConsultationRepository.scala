package model.repositories

import java.util.Date
import anorm._
import anorm.SqlParser._
import model.dtos._
import repositories.anorm._
import org.joda.time.DateTime
import play.api.db.DB
import play.api.Play.current
import repositories.anorm.{ArticleParser, ConsultationParser}


class ConsultationRepository {

  def getConsultationStats():List[ConsultationStats]  = {
    DB.withConnection { implicit c =>

      SQL"""
            with organizations as
               (

                 select id as OrganizationId, title,
             case when id in (323,324,325,326,327,328,350,351,331,332,349) then 'Υπουργεία'
             when id in (343,345,347,342,341,346,348,344,340) then 'Πρώην Υπουργεία'
             when id in (335,333,334,338,339,336,330,329,337) then 'Άλλοι φορείς'
             else 'n/a'
             End  as categTitle,
             case when id in (323,324,325,326,327,328,350,351,331,332,349) then 1
             when id in (343,345,347,342,341,346,348,344,340) then 2
             when id in (335,333,334,338,339,336,330,329,337) then 3
             else 3
             End  as order
             from public.organization_lkp
             ),
             CommentsPerConsultation as
               (
                 select consultation_id,count(a.consultation_id) as NumberOfArticles,
                 sum(case when comment_num<0 then 0 else comment_num end) as NumberOfComments
               from public.articles a
               group by a.consultation_id
             )

             select c.id,m.NumberOfArticles,m.NumberOfComments,  DATE_PART('day',c.end_date -c.start_date) as DaysActive,
             case when c.end_date> Now() then true
           	     else false end  as isActive,
           	o.*
             from public.consultation c
               inner join organizations o on o.OrganizationId =c.organization_id
             left outer join CommentsPerConsultation as m  on m.consultation_id = c.id
             order by o.order, o.title
        """.as(ConsultationStatsParser.Parse *)
    }
  }


  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {

       //Retrieving values with string interpolation https://www.playframework.com/documentation/2.3.5/ScalaAnorm
        DB.withConnection { implicit c =>
          SQL"""
                with relatedArticles as
                (
                     select distinct consultation_id
                     from articles a
                     where
                           a.title like ${"%"+searchRequest.query+"%"} or
                           a.body like  ${"%"+searchRequest.query+"%"}
                )
                select c.*, o.title as OrganizationTitle from public.consultation c
                inner join public.organization_lkp o on c.organization_id = o.id
                where
                      c.title like ${"%"+searchRequest.query+"%"} or
                      c.short_description like ${"%"+searchRequest.query+"%"} or
                      c.id in (select a.consultation_id from relatedArticles a)
                order by id desc """.as(ConsultationParser.Parse *)
        }
  }

  def latestConsultations(maxConsultationsToReceive:Int) : List[Consultation] = {
    DB.withConnection { implicit c =>
      SQL"""
        select c.*, o.title as OrganizationTitle from public.consultation c
        inner join public.organization_lkp o on c.organization_id = o.id
        order by end_date desc limit $maxConsultationsToReceive""".as(ConsultationParser.Parse *)
    }
  }

  def get(consultationId: BigInt): Consultation =
  {
    DB.withConnection { implicit c =>
     val results = SQL"""with commentsCount as (
                          select c.article_id, count(*) as comment_num from public.comments c
                        	inner join public.articles a on c.article_id = a.id
                          where a.consultation_id= $consultationId
                          group by c.article_id
                        )
                         select c.*,
                                               o.title as OrganizationTitle,
                                               a.id as article_id,
                                               a.consultation_id,
                                               a.title as article_title,
                                               a.body as article_body,
                                               a.art_order,
                                               count.comment_num
                                                from public.consultation c
                                        inner join public.organization_lkp o on c.organization_id = o.id
                                        inner join public.articles a on a.consultation_id = c.id
                                        inner join commentsCount count on count.article_id = a.id
                                        where
                                              c.id =$consultationId
                                        order by end_date, a.art_order
        """.as((ConsultationParser.Parse ~ ArticleParser.Parse map(flatten)) *)
      //due to the inner join we have tuples of the same consultations and different articles

     // val newResults = results.groupBy(z =>{z._1}) //group results by consultation. The results is a tuple with 2 properties. (Consultation, List[(Consultation,Article)]
      val consultation:Consultation = results.head._1;  //fetch the consultation from the first property of the tuple
      for (tuple <- results)
      {
        consultation.articles  =consultation.articles :+ tuple._2
      }

      consultation
    }
  }
}
