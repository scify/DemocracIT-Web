package model.repositories

import java.util.UUID

import _root_.anorm.SqlParser._
import _root_.anorm.{SqlParser, _}
import model.dtos._
import model.repositories.anorm._
import play.api.Play.current
import play.api.db.DB


class CommentsRepository {

  def rateComment(user_id:java.util.UUID, comment_id:Long, liked:Option[Boolean]):Unit = {

    DB.withConnection { implicit c =>

      //todo: insert if not exists , else update
      if (liked.isDefined)
      {
        val likedBit = if (liked.get) 1 else 0

        SQL"""
                UPDATE comment_rating
                        set liked = CAST($likedBit AS BIT)
                        where user_id = CAST($user_id AS UUID)  and comment_id = $comment_id;

                INSERT INTO comment_rating (user_id,comment_id,liked,date_added)
                        select CAST($user_id AS UUID), $comment_id ,CAST($likedBit AS BIT) , now()
                               where not exists (select 1 from comment_rating where user_id = CAST($user_id AS UUID) and comment_id = $comment_id );

                  """.execute()
      }
      else
        SQL"""
               delete from comment_rating
                      where user_id = CAST($user_id AS UUID) and comment_id = $comment_id ;

              """.execute()

    }

  }

  def checkIfUserHasReportedComment(commentId: Long, userId: UUID): Boolean = {
    DB.withConnection { implicit c =>
      val answer: Boolean =
        SQL"""
           select exists (select * from comment_reports where user_id = cast($userId as uuid) and comment_id=$commentId);
           """.as(SqlParser.bool("exists").single)
      answer
    }
  }

  def reportComment(commentId: Long, userId: UUID): Long = {
    DB.withConnection { implicit c =>
      val reportId:Option[Long] =
        SQL"""
           INSERT INTO public.comment_reports (user_id, comment_id, created_at) VALUES (CAST($userId AS UUID), $commentId, now())
           """.executeInsert()
      reportId.get
    }
  }

  def howManyLikesToday(userId:UUID):Int = {
    DB.withConnection { implicit c =>
      val answer:Int = SQL"""
            select count(*) as numberOfCommentLikes from comment_rating where user_id = cast($userId as uuid)
            and date_part('year',date_added) = date_part('year',now())
            and date_part('month',date_added) = date_part('month',now())
            and date_part('day',date_added) = date_part('day',now())""".as(SqlParser.int("numberOfCommentLikes").single)
      answer
    }
  }

  def howManyCommentsToday(userId:UUID):Int = {
    DB.withConnection { implicit c =>
      val answer:Int = SQL"""
            select count(*) as numberOfComments from comments where user_id = cast($userId as uuid)
            and date_part('year',date_added) = date_part('year',now())
            and date_part('month',date_added) = date_part('month',now())
            and date_part('day',date_added) = date_part('day',now())""".as(SqlParser.int("numberOfComments").single)
      answer
    }
  }

  def cancelLikeReward(userId:UUID, comment_id:Long):Unit = {
    DB.withConnection { implicit c =>
      SQL"""
            delete from user_awards
            where user_id = cast($userId as UUID) and related_data = cast($comment_id as text)
              """.execute()
    }
  }

  def getCommentsByAnnId (annId:Long,
                          consultationId :Long):List[Comment]  = {

    DB.withConnection { implicit c =>
      val comments:List[Comment]=
        SQL"""
               with ratingCounter as
               (
                  select cr.comment_id,
                  sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                  sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                  from comment_rating cr
                  inner join comments c on cr.comment_id  = c.id
                  inner join public.articles a on a.id = c.article_id
                  where a.consultation_id = $consultationId
                  group by cr.comment_id
             ),
            topLevelComments as (

                  select  c.*,ann.description,u.fullName,u.avatarurl, ''::text as profileUrl, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                          cr.liked as userrating,
                          counter.likes,
                          counter.dislikes
                  from comments c
                       inner join public.articles a on a.id = c.article_id
                       inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                       inner join annotation_comment ann_comm on ann_comm.public_comment_id = c.id and c.revision = ann_comm.comment_revision
                       inner join annotation_tag ann on ann.id = ann_comm.annotation_tag_id
                       inner join account.user u on u.id = c.user_id
                       left outer join public.comment_rating cr on cr.comment_id = c.id
                       left outer join ratingCounter counter on counter.comment_id = c.id
                       where a.consultation_id = $consultationId and ann.id = $annId
             ),
           replies as (
                  select  c.*,''::text as description,u.fullName,u.avatarurl, ''::text as profileUrl, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                                    cr.liked as userrating,
                                    counter.likes,
                                    counter.dislikes
                 from comments c
                      inner join public.articles a on a.id = c.article_id
                      inner join  topLevelComments tlc on c.parent_id = tlc.id
                      inner join account.user u on u.id = c.user_id
                      inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                      left outer join public.comment_rating cr on cr.comment_id = c.id
                      left outer join ratingCounter counter on counter.comment_id = c.id
                 where a.consultation_id = $consultationId
          )
          select  * from topLevelComments
          union
          select  * from replies""".as(CommentsParser.Parse *)


      comments
    }
  }

  def getCommentsByAnnIdPerArticle (annId:Long,
                          articleId :Long):List[Comment]  = {

    DB.withConnection { implicit c =>
      val comments:List[Comment]=
        SQL"""
               with ratingCounter as
                                   (
                                    select cr.comment_id,
                                   	sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                                   	sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                                    from comment_rating cr
                                        inner join comments c on cr.comment_id  = c.id
                                        inner join public.articles a on a.id = c.article_id
                                     where c.article_id = $articleId
                                  group by cr.comment_id
                                 ),
           topLevelComments as (
                             select  c.*,ann.description,u.fullName,u.avatarurl, ''::text as profileUrl, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                                     cr.liked as userrating,
                                     counter.likes,
                                     counter.dislikes
                             from comments c
                                  inner join public.articles a on a.id = c.article_id
                                  inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                  inner join annotation_comment ann_comm on ann_comm.public_comment_id = c.id
                                  inner join annotation_tag ann on ann.id = ann_comm.annotation_tag_id
                                  inner join account.user u on u.id = c.user_id
                                  left outer join public.comment_rating cr on cr.comment_id = c.id
                                  left outer join ratingCounter counter on counter.comment_id = c.id
                                  where a.id = $articleId and ann.id = $annId
                        ),
           replies as (
                             select  c.*,''::text as description,u.fullName,u.avatarurl, ''::text as profileUrl, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                                               cr.liked as userrating,
                                               counter.likes,
                                               counter.dislikes
                            from comments c
                                 inner join public.articles a on a.id = c.article_id
                                 inner join  topLevelComments tlc on c.parent_id = tlc.id
                                 inner join account.user u on u.id = c.user_id
                                 inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                 left outer join public.comment_rating cr on cr.comment_id = c.id
                                 left outer join ratingCounter counter on counter.comment_id = c.id
                            where a.id = $articleId
                     )
                     select  * from topLevelComments
                     union
                     select  * from replies""".as(CommentsParser.Parse *)


      comments
    }
  }

  def getCommentsForConsultationByUserId (consultation_id:Long,
                                          user_id:UUID,
                                          loggedInUserId:Option[UUID]):List[CommentWithArticleName]  = {

    DB.withConnection { implicit c =>
      val comments:List[(String,Comment)]=
        SQL"""
               with ratingCounter as
                                   (
                                    select cr.comment_id,
                                   	sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                                   	sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                                    from comment_rating cr
                                        inner join comments c on cr.comment_id  = c.id
                                        inner join public.articles a on a.id = c.article_id
                                     where a.consultation_id = $consultation_id
                                  group by cr.comment_id
                                 )
              select  c.*,u.fullName,u.avatarurl, null as profileUrl, a.title as article_name, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                      cr.liked as userrating,
                      counter.likes,
                      counter.dislikes
              from comments c
                   inner join public.articles a on a.id = c.article_id
                   inner join account.user u on u.id = c.user_id
                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                   left outer join public.comment_rating cr on cr.user_id = CAST($user_id as UUID)  and cr.comment_id = c.id
                   left outer join ratingCounter counter on counter.comment_id = c.id
              where a.consultation_id = $consultation_id and c.user_id = CAST($user_id as UUID)
              order by c.date_added desc, c.id
           """.as((SqlParser.str("article_name") ~ CommentsParser.Parse map(flatten)) *)

      val relatedTags: List[(Long,AnnotationTags)]=  SQL"""
                             select ac.public_comment_id, tag.* from annotation_comment ac
                                    inner join annotation_tag tag on ac.annotation_tag_id = tag.id
                                    inner join comments c on c.id =ac.public_comment_id and c.revision = ac.comment_revision
                                    inner join articles a on a.id = c.article_id
                                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                    where c.user_id = CAST($user_id as UUID) and a.consultation_id = $consultation_id
                            """.as((SqlParser.long("public_comment_id") ~ AnnotationTypesParser.Parse map(flatten)) *)


      relatedTags.groupBy( _._1).foreach {
        tuple =>
          val c= comments.find(com => com._2.id.get == tuple._1 )
          if (c.isDefined)
            {
              var comment = c.get._2
              comment.annotationTagProblems= tuple._2.filter(_._2.type_id==2).map(_._2)
              comment.annotationTagTopics = tuple._2.filter(_._2.type_id==1).map(_._2)
            }

      }

      comments.map(tuple => {
        new CommentWithArticleName(tuple._1, tuple._2)
      })
    }
  }

  def getComments(discussionthreadclientid:String,
                  pageSize:Int,
                  user_id:Option[UUID]):List[Comment]  = {
    DB.withConnection { implicit c =>

      //It seems that None is not replaced correctly with Null by anorm
      // use a magic number... http://stackoverflow.com/questions/26798371/anorm-play-scala-and-postgresql-dynamic-sql-clause-not-working
      //      val paramMaxCommentId:Long = maxCommentId.getOrElse(-9999)
      val useridParam = if (user_id.isDefined) user_id.get else new java.util.UUID( 0L, 0L )

      val comments:List[Comment]= SQL"""
          with ratingCounter as
          (
           select cr.comment_id,
          	sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
          	sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
           from comment_rating cr
                  inner join comments c on cr.comment_id  = c.id
                  inner join  public.discussion_thread t on c.discussion_thread_id =t.id
           where t.tagid =$discussionthreadclientid
          group by cr.comment_id
         )
          select c.*, u.fullName,u.avatarurl,null as profileUrl, a.title as article_name, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                           counter.likes,
                            counter.dislikes,
                            cr.liked as userrating
                       from public.comments c
                                             inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                             inner join public.articles a on a.id = c.article_id
                                             inner join account.user u on u.id = c.user_id
                                             left outer join public.comment_rating cr on cr.user_id = CAST($useridParam as UUID)  and cr.comment_id = c.id
                                             left outer join ratingCounter counter on counter.comment_id = c.id
                    where t.tagid =$discussionthreadclientid
                     order by c.date_added desc, c.id desc
        """.as(CommentsParser.Parse *)

      val relatedTags: List[(Long,AnnotationTags)]=  SQL"""
                             select ac.public_comment_id, tag.* from annotation_comment ac
                                    inner join annotation_tag tag on ac.annotation_tag_id = tag.id
                                    inner join comments c on c.id =ac.public_comment_id and c.revision = ac.comment_revision
                                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                    where t.tagid =$discussionthreadclientid
                            """.as((SqlParser.long("public_comment_id") ~ AnnotationTypesParser.Parse map(flatten)) *)

      // group result List [Long,(tuple)]
      //                                the tuple consists of List(Long,AnnotationTags))
      relatedTags.groupBy( _._1).foreach {
        tuple =>
          val c= comments.filter(_.id.get == tuple._1).head
          c.annotationTagProblems = tuple._2.filter(_._2.type_id==2).map(_._2)
          c.annotationTagTopics = tuple._2.filter(_._2.type_id==1).map(_._2)
      }
      comments


    }
  }

  def getRssForConsulationComments(pageSize:Int,consultationId:Long):List[ConsultationRssData] = {
    DB.withConnection { implicit c =>

      SQL"""
         	select  u.fullName,
                  a.consultation_id,
                  cons.title,
                  a.title as article_name,
                  a.id as article_id,
                  t.tagid as discussion_thread_tag_id,
                  t.typeid,
                  c.id as comment_id,
                  c.date_added,
                  t.relatedText,
                  c.comment
                 from public.comments c
                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                    inner join public.articles a on a.id = c.article_id
                    inner join account.user u on u.id = c.user_id
                    inner join public.consultation cons on a.consultation_id = cons.id
 		          where a.consultation_id = $consultationId
                    and c.COMMENT is not null
              order by c.date_added desc, c.id desc
              limit $pageSize
        """.as(ConsultationRssDataParser.Parse *)

    }
  }
  def saveCommentReply(replyText:String, parentId:Long, articleId:Long, discussionthreadclientid:Long, userId:UUID):Long = {
    DB.withConnection { implicit c =>
      val commentId:Option[Long] = SQL"""
          INSERT INTO public.comments
                      (
                      url_source,
                      article_id,
                      parent_id,
                      "comment",
                      source_type_id,
                      discussion_thread_id,
                      user_id,
                      date_added,
                      revision,
                      depth,
                      annotatedtext)
          VALUES
                    (
                      NULL,
                      $articleId,
                      $parentId,
                      $replyText,
                      1,
                      $discussionthreadclientid,
                      $userId::uuid,
                      now(),
                      1,
                      1,
                      NULL)
                  """.executeInsert()

      commentId.get
    }
  }

  def getOPenGovCommentsForArticle(articleId: Long):List[Comment] = {
    DB.withConnection { implicit c =>

      val comments: List[Comment] =
        SQL"""with ratingCounter as
                      (
                       select cr.comment_id,
                      	sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                      	sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                       from comment_rating cr
                           full outer join comments c on cr.comment_id  = c.id
                        where c.article_id = $articleId
                     group by cr.comment_id
                    )
                      select c.*, o.fullname, null as avatarurl, o.link_url as profileUrl, 1 as discussion_thread_type_id,'' as discussion_thread_tag_id,
                             counter.likes,
                             counter.dislikes, false as userrating
                       from public.comments c
                         inner join public.articles a on a.id = c.article_id
                         full outer join public.comment_opengov o on o.id =c.id
                         full outer join ratingCounter counter on counter.comment_id = c.id
                         where c.article_id = $articleId
                            and c.source_type_id = 2

                         order by c.date_added desc, c.id desc""".as(CommentsParser.Parse *)

      // group result List [Long,(tuple)]
      //
      //                           the tuple consists of List(Long,AnnotationTags))
      comments
    }
  }

  def getDITCommentsForArticle(articleId: Long):List[Comment] = {
    DB.withConnection { implicit c =>

      val comments: List[Comment] =
        SQL"""with ratingCounter as
                      (
                       select cr.comment_id,
                      	sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                      	sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                       from comment_rating cr
                           full outer join comments c on cr.comment_id  = c.id
                        where c.article_id = $articleId
                     group by cr.comment_id
                    )
                    select c.*, u.fullname, u.avatarurl, null as profileUrl, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                            counter.likes,
                            counter.dislikes,
                            cr.liked as userrating from comments c
           				  inner join account.user u on u.id = c.user_id
                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
           				  left outer join public.comment_rating cr on cr.user_id = CAST(c.user_id as UUID)  and cr.comment_id = c.id
           				  left outer join ratingCounter counter on counter.comment_id = c.id
                    where c.article_id = $articleId

                    order by c.date_added desc, c.id desc""".as(CommentsParser.Parse *)

      val relatedTags: List[(Long,AnnotationTags)]=  SQL"""
                             select ac.public_comment_id, tag.* from annotation_comment ac
                                    inner join annotation_tag tag on ac.annotation_tag_id = tag.id
                                    inner join comments c on c.id =ac.public_comment_id and c.revision = ac.comment_revision
                                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                    where c.article_id = $articleId
                            """.as((SqlParser.long("public_comment_id") ~ AnnotationTypesParser.Parse map(flatten)) *)

      // group result List [Long,(tuple)]
      //                                the tuple consists of List(Long,AnnotationTags))
      relatedTags.groupBy( _._1).foreach {
        tuple =>
          val c= comments.filter(_.id.get == tuple._1).head
          c.annotationTagProblems = tuple._2.filter(_._2.type_id==2).map(_._2)
          c.annotationTagTopics = tuple._2.filter(_._2.type_id==1).map(_._2)
      }
      comments
    }
  }

  def getOpenGovCommentsForConsultation(consultationId: Long):List[Comment] = {
    DB.withConnection { implicit c =>

      val comments: List[Comment] =
        SQL"""with ratingCounter as
                      (
                       select cr.comment_id,
                      	sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                      	sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                       from comment_rating cr
                           full outer join comments c on cr.comment_id  = c.id
                           inner join public.articles a on a.id = c.article_id
                           where a.consultation_id = $consultationId
                     group by cr.comment_id
                    )
                      select c.*, o.fullname, null as avatarurl, o.link_url as profileUrl, 1 as discussion_thread_type_id,
                             counter.likes,
                             counter.dislikes, false as userrating
                       from public.comments c
                         inner join public.articles a on a.id = c.article_id
                         full outer join public.comment_opengov o on o.id =c.id
                         full outer join ratingCounter counter on counter.comment_id = c.id
                         where a.consultation_id = $consultationId
                            and c.source_type_id = 2

                         order by c.date_added desc, c.id desc""".as(CommentsParser.Parse *)

      comments
    }
  }

  def getDITCommentsForConsultation(consultationId: Long):List[Comment] = {
    DB.withConnection { implicit c =>

      val comments: List[Comment] =
        SQL"""with ratingCounter as
                     (
                      select cr.comment_id,
                      sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                      sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                      from comment_rating cr
                          full outer join comments c on cr.comment_id  = c.id
        inner join public.articles a on a.id = c.article_id
                                    where a.consultation_id = $consultationId
                    group by cr.comment_id
                   )
                     select  c.*,u.fullName,u.avatarurl, null as profileUrl, t.typeid as discussion_thread_type_id,t.tagid as discussion_thread_tag_id,
                     cr.liked as userrating,
                     counter.likes,
                     counter.dislikes
             from comments c
                  inner join public.articles a on a.id = c.article_id
                  inner join account.user u on u.id = c.user_id
                  inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                  left outer join public.comment_rating cr on cr.user_id = c.user_id  and cr.comment_id = c.id
                  left outer join ratingCounter counter on counter.comment_id = c.id
             where a.consultation_id = $consultationId

              order by c.date_added desc, c.id desc""".as(CommentsParser.Parse *)

      val relatedTags: List[(Long,AnnotationTags)]=  SQL"""
                             select ac.public_comment_id, tag.* from annotation_comment ac
                                    inner join annotation_tag tag on ac.annotation_tag_id = tag.id
                                    inner join comments c on c.id =ac.public_comment_id and c.revision = ac.comment_revision
                                    inner join  public.discussion_thread t on c.discussion_thread_id =t.id
                                    inner join public.articles a on a.id = c.article_id
                                    where a.consultation_id = $consultationId
                            """.as((SqlParser.long("public_comment_id") ~ AnnotationTypesParser.Parse map(flatten)) *)

      // group result List [Long,(tuple)]
      //                                the tuple consists of List(Long,AnnotationTags))
      relatedTags.groupBy( _._1).foreach {
        tuple =>
          val c= comments.filter(_.id.get == tuple._1).head
          c.annotationTagProblems = tuple._2.filter(_._2.type_id==2).map(_._2)
          c.annotationTagTopics = tuple._2.filter(_._2.type_id==1).map(_._2)
      }

      comments
    }
  }

  def getTagsForConsultation(consultation_id:Long):List[AnnotationTagWithComments] = {

    DB.withConnection { implicit c =>
      //one way to do it
      val tagsWithComments: List[(AnnotationTagWithComments)] = SQL"""
                      with comm as (
                            select c.*
                                      from comments c inner join public.articles a on a.id = c.article_id
                                      inner join public.consultation con on con.id = a.consultation_id
                                      where a.consultation_id = $consultation_id
                            )
                            select ann_comm.annotation_tag_id as id, annotation_tag.description, annotation_tag.type_id, count(ann_comm.annotation_tag_id) as comments_num
                              from annotation_comment ann_comm
                              inner join comm on ann_comm.public_comment_id = comm.id  and comm.revision = ann_comm.comment_revision
                              inner join annotation_tag on annotation_tag.id = ann_comm.annotation_tag_id
                              group by ann_comm.annotation_tag_id,annotation_tag.id
                            """.as(AnnotationTagWithCommentsParser.Parse  *)

      tagsWithComments

      //    //second way
      //    val tagsWithComments2: List[AnnotationTagWithComments]=  SQL"""
      //                             select tag.*, comments_num from annotation_comment ac
      //                            """.as(AnnotationTagWithCommentsParser.Parse *)
    }
  }

  def getCommentersForConsultation(consultation_id:Long):List[UserCommentStats] = {

    DB.withConnection { implicit c =>
      val userCommentStats: List[(UserCommentStats)] = SQL"""
          with comm as (
              select c.*
              from comments c inner join public.articles a on a.id = c.article_id
              inner join public.consultation con on con.id = a.consultation_id
              where a.consultation_id = $consultation_id
          )
          select account.user.id as user_id, account.user.firstname as first_name, account.user.lastname as last_name, account.user.email, account.user.role, count(account.user.id) as number_of_comments
          from account.user
          inner join comm on account.user.id = comm.user_id
          group by account.user.id""".as(UserCommentsStatsParser.Parse  *)

      userCommentStats

    }
  }


  def getCommentsPerArticle(consultationId:Long):List[Article] = {
    DB.withConnection { implicit c =>
      val commentsForArticles : List[Article] = SQL"""
                                                     with ac as (
                                                     select a.id, count(*) as comments_num
                                                     			from comments c inner join public.articles a on a.id = c.article_id
                                                     					inner join public.consultation con on con.id = a.consultation_id
                                                     			where a.consultation_id = $consultationId  and c.parent_id is null
                                                     			group by a.id
                                                     )
                                                     select a.id as article_id, a.consultation_id, a.body as article_body, a.title as article_title, a.art_order, ac.comments_num as comment_num
                                                     from articles a
                                                      inner join ac on a.id = ac.id
                                                      where a.consultation_id =  $consultationId
                            """.as(ArticleParser.Parse  *)
      //as((ArticleParser.Parse ~ SqlParser.int("comments_num") map (flatten)) *)

      commentsForArticles
      //      commentsForArticles.map(tuple => {
      //        new CommentsPerArticle(tuple._1, tuple._2)
      //      })

    }
  }

  def getTagsPerArticle(consultation_id:Long):List[AnnotationTagPerArticleWithComments] = {

    DB.withConnection { implicit c =>
      //one way to do it
      val tagsWithComments: List[(AnnotationTags, String,Int, Int)] = SQL"""
                             with comm as (
                                            select c.*
                                            from comments c inner join public.articles a on a.id = c.article_id
                                            inner join public.consultation con on con.id = a.consultation_id
                                            where a.consultation_id = $consultation_id  and c.parent_id is null
                                          )
                                        select articles.title as article_title,
                                              articles.id as article_id,
                                              ann_comm.annotation_tag_id as id,
                                              annotation_tag.description,
                                              annotation_tag.type_id,
                                              count(ann_comm.annotation_tag_id) as comments_num
                                        from annotation_comment ann_comm
                                        inner join comm on ann_comm.public_comment_id = comm.id  and comm.revision = ann_comm.comment_revision
                                        inner join annotation_tag on annotation_tag.id = ann_comm.annotation_tag_id
                                        inner join articles on articles.id = comm.article_id
                                        group by ann_comm.annotation_tag_id,annotation_tag.id, articles.id
                            """.as((AnnotationTypesParser.Parse ~ SqlParser.str("article_title") ~ SqlParser.int("article_id") ~ SqlParser.int("comments_num") map (flatten)) *)

      tagsWithComments.map(tuple => {
        new AnnotationTagPerArticleWithComments(tuple._1, tuple._2, tuple._3,tuple._4)
      })

      //    //second wait
      //    val tagsWithComments2: List[AnnotationTagWithComments]=  SQL"""
      //                             select tag.*, comments_num from annotation_comment ac
      //                            """.as(AnnotationTagWithCommentsParser.Parse *)
    }
  }

  def getOpenGovComments(consultationId:Long,
                         articleId:Long,
                         pageSize:Int,
                         user_id:Option[java.util.UUID]
                          ):List[Comment]  = {
    DB.withConnection { implicit c =>

      val useridParam = if (user_id.isDefined) user_id.get else new java.util.UUID( 0L, 0L )

      //todo: add paging
      SQL"""
          with ratingCounter as
                      (
                       select cr.comment_id,
                      	sum(case when CAST(cr.liked as INT) =1 then 1 else 0 end) as likes,
                      	sum(case when CAST(cr.liked as INT) =0 then 1 else 0 end) as dislikes
                       from comment_rating cr
                           inner join comments c on cr.comment_id  = c.id
                        where c.article_id = $articleId
                                 and  c.source_type_id= 2
                     group by cr.comment_id
                    )
                      select c.*, o.fullName, null as avatarurl, o.link_url as profileUrl,null as discussion_thread_type_id,'' as discussion_thread_tag_id,
                             cr.liked as userrating,
                             counter.likes,
                             counter.dislikes
                       from public.comments c
                         left outer join public.comment_opengov o on o.id =c.id
                         left outer join public.comment_rating cr on cr.user_id = CAST($useridParam as UUID)  and cr.comment_id = c.id
                         left outer join ratingCounter counter on counter.comment_id = c.id
                         where c.article_id = $articleId
                                 and  c.source_type_id= 2

                         order by c.date_added desc, c.id desc
        """.as(CommentsParser.Parse *)
    }
  }

  private def getDiscussionThreadId(discussionThreadTagId:String):Long = {
    DB.withConnection { implicit c =>
      SQL"""
           select id from public.discussion_thread t where t.tagid = $discussionThreadTagId
              """.as(SqlParser.long("id").single)

    }
  }

  /* Saves a discussion thread only if does not exist already.
  * In case a new discussion thread is created then the id is returned
  * */
  def saveDiscussionThread(discussionThreadTagId:String,discussionThreadWholeText:String, discussionThreadTypeId:Int): Option[Long] =
  {
    DB.withConnection { implicit c =>
      val result = SQL"""
           insert into public.discussion_thread (tagid,relatedText, typeid)
            select $discussionThreadTagId,$discussionThreadWholeText,$discussionThreadTypeId
            where not exists (select 1 from public.discussion_thread where tagid = $discussionThreadTagId)
              """.executeInsert()

      if (result.asInstanceOf[Option[Long]].isDefined)
        result
      else
      {
        val id=  SQL"""
             select id from public.discussion_thread t where t.tagid = $discussionThreadTagId
                """.as(SqlParser.long("id").single)

        Some(id)
      }
    }
  }

  def loadDiscussionThreadsWithCommentsCount(consultationId:Long): Seq[DiscussionThread] =
  {
    DB.withConnection { implicit c =>
      SQL"""
              select t.id,t.tagid, t.typeid, count(*) as numberOfComments from public.comments c
                inner join public.articles a on a.id = c.article_id
                inner join public.discussion_thread t on t.id = c.discussion_thread_id
                where a.consultation_id = $consultationId and c.parent_id is null
              group by t.id,t.tagid
              """.as(DiscussionThreadWithCommentsCountParser.Parse *)
    }
  }

  def loadAnnotationTags():Seq[AnnotationTags] = {

    DB.withConnection { implicit c =>

      val sql = SQL("select * from public.annotation_tag where status_id not in (4,5)") //hide rejected or deleted comments

      sql().map( row =>
        AnnotationTags(row[Long]("id"), row[String]("description"), row[Int]("type_id"))
      ).toList

    }

  }

  def saveOldComment(commentId: Long) = {
    DB.withTransaction() { implicit c =>
      //we store the old comment at comment_history table, retrieve the id of the comment_history row
      val commentHistoryId = SQL"""
          INSERT INTO public.comment_history (
                         		comment_parent_id,
                             url_source,
                             article_id,
                             parent_id,
                             "comment",
                             source_type_id,
                             discussion_thread_id,
                             user_id,
                             date_added,
                             revision,
                             depth,
                             annotatedtext,
                             emotion_id, updated_at) select *, now() as updated_at from comments where id=$commentId""".execute()
    }
  }

  def updateComment(comment: Comment) ={
    DB.withTransaction() { implicit c =>
      SQL"""UPDATE public.comments
           SET "comment" = ${comment.body},
               revision = ${comment.revision + 1},
               emotion_id = ${comment.emotionId}
           WHERE id = ${comment.id}
         """.execute()
      val annotationTags = comment.annotationTagProblems ::: comment.annotationTagTopics

      for (annotation <- annotationTags )
      {
        if (annotation.id == -1)
        {
          //if it already exists we request the id, else save and retrieve it
          val annotationid: Long= SQL"""
                                     with existing as (
                                          SELECT id FROM annotation_tag WHERE description = ${annotation.description}
                                     ),
                                     new as (
                                         INSERT INTO annotation_tag   (description,type_id,date_added,status_id)
                                         SELECT ${annotation.description} as description,
                                                ${annotation.type_id} as type_id ,
                                                now() as date_added,
                                                2 as status_id
                                         WHERE NOT EXISTS ( select id from existing)
                                         returning id
                                     )
                                     select id from new
                                      union all
                                     select id from existing

                                """.as(SqlParser.long("id").single) // .executeInsert()

          annotation.id = annotationid
        }

        SQL"""
              INSERT INTO public.annotation_comment
                          (public_comment_id,annotation_tag_id, comment_revision)
              VALUES
              (${comment.id},${annotation.id}, ${comment.revision + 1})
            """.execute()

      }
    }
  }

  def saveUpdatedComment(comment: Comment) = {
    saveOldComment(comment.id.get)
    updateComment(comment)
  }

  def saveComment(comment: Comment, discussionThreadId: Long): Option[Long] ={
    DB.withTransaction() { implicit c =>


      val commentId = SQL"""
          INSERT INTO public.comments
                      (
                      url_source,
                      article_id,
                      parent_id,
                      "comment",
                      source_type_id,
                      discussion_thread_id,
                      user_id,
                      date_added,
                      revision,
                      depth,
                      annotatedtext,
                      emotion_id)
          VALUES
                    (
                      NULL,
                      ${comment.articleId},
                      NULL,
                      ${comment.body},
                      1,
                      ${discussionThreadId},
                      ${comment.userId}::uuid,
                      now(),
                      ${comment.revision},
                      ${comment.depth},
                      ${comment.userAnnotatedText},
                      ${comment.emotionId})
                  """.executeInsert()


      val annotationTags = comment.annotationTagProblems ::: comment.annotationTagTopics

      for (annotation <- annotationTags )
      {
        if (annotation.id == -1)
        {
          //if it already exists we request the id, else save and retrieve it
          val annotationid: Long= SQL"""
                                     with existing as (
                                          SELECT id FROM annotation_tag WHERE description = ${annotation.description}
                                     ),
                                     new as (
                                         INSERT INTO annotation_tag   (description,type_id,date_added,status_id)
                                         SELECT ${annotation.description} as description,
                                                ${annotation.type_id} as type_id ,
                                                now() as date_added,
                                                2 as status_id
                                         WHERE NOT EXISTS ( select id from existing)
                                         returning id
                                     )
                                     select id from new
                                      union all
                                     select id from existing

                                """.as(SqlParser.long("id").single) // .executeInsert()

          annotation.id = annotationid
        }

        SQL"""
              INSERT INTO public.annotation_comment
                          (public_comment_id,annotation_tag_id, comment_revision)
              VALUES
              ($commentId,${annotation.id},${comment.revision})
            """.execute()

      }

      commentId
    }
  }


}
