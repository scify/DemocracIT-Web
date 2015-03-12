package democracit.repositories


import java.util.Date

import anorm._
import anorm.SqlParser._
import democracit.dtos._
import org.joda.time.DateTime
import play.api.db.DB
import play.api.Play.current
import repositories.anorm.{ArticleParser, ConsultationParser}


class ConsultationRepository {

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
                order by end_date""".as(ConsultationParser.Parse *)
        }
  }

  def get(consultationId: BigInt): Consultation =
  {
    DB.withConnection { implicit c =>
     val results = SQL"""
                select c.*,
                       o.title as OrganizationTitle,
                       a.id as article_id,
                       a.consultation_id,
                       a.title as article_title,
                       a.body as article_body,
                       a.art_order,
                       a.comment_num
                        from public.consultation c
                inner join public.organization_lkp o on c.organization_id = o.id
                inner join public.articles a on a.consultation_id = c.id
                where
                      c.id =$consultationId
                order by end_date, a.art_order
        """.as((ConsultationParser.Parse ~ ArticleParser.Parse map(flatten)) *)
      //due to the inner join we have tuples of the same consultations and different articles

      val newResults = results.groupBy(z =>{z._1}) //group results by consultation. The results is a tuple with 2 properties. (Consultation, List[(Consultation,Article)]
      val consultation:Consultation = newResults.head._1;  //fetch the consultation from the first property of the tuple
      for (tuple <- newResults.head._2)
      {
        consultation.articles  =consultation.articles :+ tuple._2
      }

      consultation
    }
  }
}
