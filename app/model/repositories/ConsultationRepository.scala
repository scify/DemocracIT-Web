package model.repositories

import java.util.UUID

import _root_.anorm.SqlParser._
import _root_.anorm._
import model.dtos._
import model.repositories.anorm.{ArticleParser, ConsultationParser, _}
import play.api.Play.current
import play.api.db.DB


class ConsultationRepository {


  def getConsultationStats():List[ConsultationStats]  = {
    DB.withConnection { implicit c =>

      SQL"""
            with organizations as
               (

                 select id as OrganizationId, title, group_title as categTitle,
             case when group_title in ('Not for Profits') then 1
                  when group_title  in ('Municipalities') then 2
                  when group_title  in ('Ministries') then 3
             else 4
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

  def getFinalLawAnnotationsForComment(commentId:Long, finalLawId:Long): List[FinalLawUserAnnotation] ={
    DB.withConnection { implicit c =>

      val results = SQL"""
         select fl_cm.*, fl_cm_areas.ann_id, u.fullname as user_name from final_law_comment_matching fl_cm
         	  inner join final_law_comment_matching_areas fl_cm_areas on fl_cm.id = fl_cm_areas.final_law_ann_id
            inner join account.user u on u.id = fl_cm.user_id
         	  where fl_cm.comment_id = $commentId and fl_cm.final_law_id = $finalLawId and fl_cm.active = true;
        """.as((FinalLawAnnotationParser.Parse ~ SqlParser.str("ann_id")) *)

      val newResults = results.groupBy(z =>{z._1})

     // val finalLawUserAnnotation:FinalLawUserAnnotation = results.head._1;
      for (tuple <- newResults)  // (FinalLawUserAnnotation, List[(FinalLawUserAnnotation ,List[String])])
      {
        //tuple._1 contains the FinalLawUserAnnotation
        //tuple._2 contains the List[(FinalLawUserAnnotation ,List[String])]
        tuple._1.annotationIds = tuple._2.map(x=> x._2)

      }
      newResults.map(x=>x._1).toList
    }
  }

  def saveFinalLawAnnotation(userId: UUID, commentId:Long, finalLawId: Long, annotationIds: List[String]):Option[Long] = {
    DB.withTransaction() { implicit c =>
      val finalLawAnnId =
        SQL"""
          INSERT INTO public.final_law_comment_matching
                      (
                      user_id,
                      comment_id,
                      date_added,
                      final_law_Id
                      )
          VALUES
                    (
                      cast($userId as uuid),
                      $commentId,
                      now(),
                      $finalLawId)
                  """.executeInsert()
      for (annId <- annotationIds) {
        SQL"""
              INSERT INTO public.final_law_comment_matching_areas
                          (final_law_ann_id,ann_id)
              VALUES
              ($finalLawAnnId,$annId)
            """.execute()
      }
      finalLawAnnId
    }
  }

  def updateFinalLawAnnotation(userId: UUID, commentId:Long, finalLawId: Long, annotationIds: List[String]):Option[Long] = {
    DB.withTransaction() { implicit c =>
      val finalLawAnnId =
        SQL"""
              UPDATE public.final_law_comment_matching SET active = false WHERE user_id = cast($userId AS UUID) and final_law_Id = $finalLawId
          """.execute()
      saveFinalLawAnnotation(userId, commentId, finalLawId, annotationIds)
    }
  }

  def rateFinalLaw(userId: UUID, consultationId: Long, finalLawId: Long, attitude: Int, liked:Boolean):Unit = {
    var column = "num_of_approvals"
    if(attitude == 1) {
      column = "num_of_dissaprovals"
    }
    DB.withConnection { implicit c =>
        var likedBit = if (liked) 1 else 0
        if(likedBit == 1) {
          SQL( """update consultation_final_law set """ + column + """ = """ + column + """ + 1 where consultation_id =""" + consultationId + """ and id =""" + finalLawId).execute()
          if(likedBit == 1 && attitude == 1) {
            SQL"""
                UPDATE consultation_final_law
                        set active = CAST(0 AS BIT)
                        where id = $finalLawId  and consultation_id = $consultationId and num_of_dissaprovals > 4;""".execute()
          }
          if(attitude == 1) {
            likedBit = 0
          }
          SQL"""
                UPDATE consultation_final_law_rating
                        set liked = CAST($likedBit AS BIT)
                        where user_id = CAST($userId AS UUID)  and consultation_id = $consultationId;

                INSERT INTO consultation_final_law_rating (user_id, consultation_id,liked,date_added, final_law_id, is_rating_active)
                        select CAST($userId AS UUID), $consultationId ,CAST($likedBit AS BIT) , now(), $finalLawId, 1
                               where not exists (select 1 from consultation_final_law_rating where user_id = CAST($userId AS UUID) and consultation_id = $consultationId );

                  """.execute()
        } else {
          SQL( """update consultation_final_law set """ + column + """ = """ + column + """ - 1 where consultation_id =""" + consultationId + """ and id =""" + finalLawId).execute()
//          SQL"""
//               delete from consultation_final_law_rating
//                      where user_id = CAST($userId AS UUID) and consultation_id = $consultationId ;
//
//              """.execute()
          SQL"""
               update consultation_final_law_rating set is_rating_active = 0
                      where user_id = CAST($userId AS UUID) and final_law_id = $finalLawId
              """.execute()

        }
    }
  }

  def deleteFinalLaw(finalLawId: Long):Unit = {
    DB.withConnection { implicit c =>
      SQL"""
         update consultation_final_law set active = CAST(0 AS BIT) where id = $finalLawId
         """.execute()
    }
  }

  def getFinalLawUploader(finalLawId: Long):String = {
    DB.withConnection { implicit c =>
      val userId:String = SQL"""
         select cast(user_id as text) from consultation_final_law  where id = $finalLawId
         """.as(SqlParser.str("user_id").single)
      userId
    }
  }


  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {

       //Retrieving values with string interpolation https://www.playframework.com/documentation/2.3.5/ScalaAnorm
        DB.withConnection { implicit c =>
          SQL"""
                select c.*, o.title as OrganizationTitle from public.consultation c
                inner join public.organization_lkp o on c.organization_id = o.id
                where
                      c.title like ${"%"+searchRequest.query+"%"} or
                      o.title like ${"%"+searchRequest.query+"%"}
                order by end_date desc """.as(ConsultationParser.Parse *)
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

  def getRelevantMaterial (consultationId: Long):Seq[RelevantMaterial] = {
    DB.withConnection { implicit c =>
      val results = SQL"""
        select c.* from public.relevant_mat c where c.consultation_id = $consultationId
        """.as(RelevantMaterialParser.Parse *)
      results
    }

  }

  def getRelevantLaws (consultationId: Long):Seq[RelevantLaws] = {
    DB.withConnection { implicit c =>
      val results = SQL"""
        select c.*, ar.title from public.article_entities c
            inner join articles ar on c.article_id = ar.id
            where c.consultation_id =  $consultationId
        """.as(RelevantLawsParser.Parse *)
      results
    }

  }

  def getConsultationFinalLaw (consultationId: Long): Option[ConsultationFinalLaw] = {
    DB.withConnection { implicit c =>

      SQL"""
        select * from public.consultation_final_law where consultation_id =  $consultationId and active = CAST(1 AS BIT)
        """.as(ConsFinalLawParser.Parse *).headOption

    }
  }

  def getFinalLawRatingUsers(consultationId:Long, finalLawId:BigInt): List[ConsFinalLawRatingUsers] = {
    DB.withConnection { implicit c =>
      SQL"""
           select consultation_final_law_rating.user_id, final_law_id, consultation_final_law_rating.consultation_id, liked from consultation_final_law_rating
              inner join consultation_final_law law on law.id = consultation_final_law_rating.final_law_id
              where consultation_final_law_rating.consultation_id = $consultationId and law.active = CAST(1 AS BIT) and consultation_final_law_rating.is_rating_active = 1
         """.as(ConsFinalLawRatingUsersParser.Parse *)
    }
  }

  def storeFinalLawInDB(consultationId:Long, finalLawPath:String, finalLawText:String, userId:java.util.UUID):Unit = {
    DB.withConnection { implicit c =>
      SQL"""
           insert into consultation_final_law(consultation_id, user_id, date_added, file_text, file_path, active) values
           ($consultationId, $userId::uuid, now(), $finalLawText, $finalLawPath, CAST(1 AS BIT))
         """.execute()
    }
  }

  def setConsultationFinalLawInactive(finalLawId:Long): Unit = {
    DB.withConnection { implicit c =>
      SQL""" update consultation_final_law set active = 0""".execute()
    }
  }

  def get(consultationId: BigInt): Consultation =
  {
    DB.withConnection { implicit c =>
     val results = SQL"""with openGovcommentsCount as (
                          select c.article_id, count(*) as comment_num from public.comments c
                        	inner join public.articles a on c.article_id = a.id
                          where a.consultation_id= $consultationId
                                and c.source_type_id =2
                          group by c.article_id
                        )
                         select c.*,
                                               o.title as OrganizationTitle,
                                               a.id as article_id,
                                               a.consultation_id,
                                               a.title as article_title,
                                               a.body as article_body,
                                               a.art_order,
                                               openGovCount.comment_num
                                                from public.consultation c
                                        inner join public.organization_lkp o on c.organization_id = o.id
                                        inner join public.articles a on a.consultation_id = c.id
                                        left outer join openGovcommentsCount  openGovCount on openGovCount.article_id = a.id
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
