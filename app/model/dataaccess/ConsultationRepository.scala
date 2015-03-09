package model.dataaccess

import anorm._;
import model._
import play.api.db.DB


class ConsultationRepository {

  override def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {

    val queryCommand = SQL(
      """
        |with relatedArticles as
        |(
        |     select distinct consultation_id
        |     from articles a
        |     where
        |           a.title like '%{query}%' or
        |           a.body like   '%{query}%'
        |)
        |select c.*, o.title as OrganizationTitle from public.consultation c
        |inner join public.organization_lkp o on c.organization_id = o.id
        |where
        |      c.title like '%{query}%' or
        |      c.short_description like '%{query}%' or
        |      c.id in (select a.consultation_id from relatedArticles a)
        |order by end_date
        |
      """.stripMargin).on("query" -> searchRequest.query);
    DB.withConnection { implicit c =>
      val consultations = queryCommand().map(row=> "").toList
    }
  }

  override def get(consultationId: Int): Consultation =
  {
    val queryCommand = SQL(
      """
        |with relatedArticles as
        |(
        |     select distinct consultation_id
        |     from articles a
        |     where
        |           a.title like '%{query}%' or
        |           a.body like   '%{query}%'
        |)
        |select c.*, o.title as OrganizationTitle from public.consultation c
        |inner join public.organization_lkp o on c.organization_id = o.id
        |where
        |      c.title like '%{query}%' or
        |      c.short_description like '%{query}%' or
        |      c.id in (select a.consultation_id from relatedArticles a)
        |order by end_date
        |
      """.stripMargin).on("query" -> searchRequest.query);
    DB.withConnection { implicit c =>
      val consultations = queryCommand().map(row=> "").toList
    }
  }
}
