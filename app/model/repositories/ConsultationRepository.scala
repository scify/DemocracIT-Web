package democracit.repositories


import anorm._
import democracit.dtos._
import org.joda.time.DateTime
import play.api.db.DB
import play.api.Play.current


class ConsultationRepository {

  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {

    val queryCommand = SQL(
      """
         with relatedArticles as
        |(
        |     select distinct consultation_id
        |     from articles a
        |     where
        |           a.title like '%Νόμος%' or
        |           a.body like   '%Νόμος%'
        |)
        |select c.*, o.title as OrganizationTitle from public.consultation c
        |inner join public.organization_lkp o on c.organization_id = o.id
        |where
        |      c.title like '%Νόμος%' or
        |      c.short_description like '%Νόμος%' or
        |      c.id in (select a.consultation_id from relatedArticles a)
        |order by end_date
      """.stripMargin).on("query" -> searchRequest.query);


    DB.withConnection { implicit c =>
       val consultations =queryCommand().map(
          row=> new Consultation(
                  row[Int]("id"),
                  row[DateTime]("start_date"),
                  row[DateTime]("end_date"),
                  row[String]("title"),
                  row[String]("short_description"),
                  new Organization(row[BigInt]("organization_id"),row[String]("organization_title")),
                  1,
                  row[String]("report_text"),
                  row[Int]("num_of_articles"),
                  null
              )).toList

      consultations
    }

  }

  def get(consultationId: Int): Consultation =
  {
//    val queryCommand = SQL(
//      """
//        |with relatedArticles as
//        |(
//        |     select distinct consultation_id
//        |     from articles a
//        |     where
//        |           a.title like '%{query}%' or
//        |           a.body like   '%{query}%'
//        |)
//        |select c.*, o.title as OrganizationTitle from public.consultation c
//        |inner join public.organization_lkp o on c.organization_id = o.id
//        |where
//        |      c.title like '%{query}%' or
//        |      c.short_description like '%{query}%' or
//        |      c.id in (select a.consultation_id from relatedArticles a)
//        |order by end_date
//        |
//      """.stripMargin).on("query" ->consultationId);
//    DB.withConnection { implicit c =>
//      val consultations = queryCommand().map(row=> "").toList
//    }
    ???
  }
}
