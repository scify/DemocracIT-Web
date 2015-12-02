package model.services

import java.util
import java.util.{UUID, Date}

import model.User
import model.dtos.{PlatformStats, _}
import model.repositories._
import model.viewmodels._
import org.scify.democracit.solr.DitSorlQuery
import play.api.Play.current
import play.api.libs.json.JsValue
import play.api.libs.ws.WS

import scala.concurrent.Await

class ConsultationManager {

  private val commentsPageSize = 50

  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {

    if (searchRequest.query.length==0)
    {
      //todo: discuss with George how we can do a solr query with wildcards.
       val repository = new ConsultationRepository()
        repository.search(searchRequest)
    }
    else
    {
      val url = play.api.Play.current.configuration.getString("application.solrBaseUrl")
      val q= new DitSorlQuery(url.get)
      val ministryIds = new util.HashSet[java.lang.Long]()

      if (searchRequest.ministryId>0)
        ministryIds.add(searchRequest.ministryId.asInstanceOf[Long])

      val res = q.queryConsultations(searchRequest.query,false,ministryIds)
      val i =res.iterator()
      var consultations = List[Consultation]()
      while(i.hasNext()) {
        val c= i.next()
        val organization = c.getOrganizationId()
        consultations = Consultation(c.getId(),
          c.getStartDate(),
          c.getEndDate(),
          c.getTitle(),c.getShortDescription,
          Organization(organization.getId().toInt,organization.getTitle()),
          1,
          Some(c.getReportText()),
          Some(c.getReportUrl()),
          Some(c.getCompletedText()),
          c.getNumOfArticles(),
          c.getConsultationUrl()) :: consultations
      }
      consultations
    }


  }

  def get(consultationId: Long, user:Option[User]): ConsultationViewModel= {
    val repository = new ConsultationRepository()
    val commentsRepo = new CommentsRepository()
    val annotationTags = commentsRepo.loadAnnotationTags()

    val consultation = repository.get(consultationId);
    var finalLaw:Option[ConsultationFinalLaw] = repository.getConsultationFinalLaw(consultationId)
    var ratingUsers: Seq[ConsFinalLawRatingUsers]= Nil;
    if (!consultation.isActive) {
      finalLaw = repository.getConsultationFinalLaw(consultation.id)
      if (finalLaw.isDefined)
        ratingUsers= repository.getFinalLawRatingUsers(consultationId, finalLaw.get.id)
    }


    ConsultationViewModel(consultation = consultation,
                          annotationsRelatedToProblems = annotationTags.filter(_.type_id==2),
                          annotationsRelatedToTopics= annotationTags.filter(_.type_id==1),
                          discussionThreads = commentsRepo.loadDiscussionThreadsWithCommentsCount(consultationId),
                          user = user,
                          relevantMaterials = repository.getRelevantMaterial(consultationId),
                          relevantLaws = repository.getRelevantLaws(consultationId),
                          finalLaw,
                          ratingUsers = ratingUsers)
  }


  def rateFinalLaw(userId: UUID, consultationId: Long, finalLawId: Long, attitude: Int, liked:Boolean){
    val repository = new ConsultationRepository()
    repository.rateFinalLaw(userId, consultationId, finalLawId, attitude, liked)
  }


  def getConsultationWordCloud(consultationId:Long):JsValue = {
    import scala.concurrent.ExecutionContext.Implicits.global
    import scala.concurrent.duration._

   val result = Await.result(
      WS.url(play.api.Play.current.configuration.getString("application.wordCloudBaseUrl").get)
        .withQueryString("consultation_id" -> consultationId.toString, "max_terms" -> "30").get map {
        response => {
          response.json
        }
      },25 seconds)

    result

  }

  def median(s: List[Int]):Int = {
    val (lower, upper) = s.sortWith(_<_).splitAt(s.size / 2)
    if (s.size % 2 == 0) Math.ceil((lower.last + upper.head) / 2.0).asInstanceOf[Int]  else upper.head
  }

  def getConsultationsForHomePage(user: Option[model.User]): HomeViewModel = {

    val consultations = new ConsultationRepository().latestConsultations(10)
    val today = new Date();
    new HomeViewModel(
      activeConsultations = consultations.filter(p => p.endDate.after(today)),
      recentConsultations = consultations.filter(p => p.endDate.before(today)),
      calculatePlatformStats(),
      user
    )
  }

  private def calculatePlatformStats() = {
    val repository = new ConsultationRepository()
    val consultationStats = repository.getConsultationStats()

    val organizationStats  = consultationStats.groupBy(_.organizationId).map(tuple =>
      OrganizationStats(id = tuple._1,
        title = tuple._2(0).organizationTitle,
        category = tuple._2(0).organizationCategory,
        categDisplayOrder = tuple._2(0).organizationOrder,
        consultationCount = tuple._2.length,
        activeConsultations =tuple._2.filter(_.isActive).length,
        medianAverageComments = median(tuple._2.map(_.numberOfComments)),
        medianAverageDays = median(tuple._2.map(_.daysActive)))
    ).toList

    val organizationStatsPerCategory = organizationStats.groupBy(_.category).map(tuple=>
      OrganizationStatsGrouped(tuple._2(0).categDisplayOrder,tuple._1,tuple._2)
    ).toList.sortBy(_.orderId)

    PlatformStats(
      totalConsultations = consultationStats.length,
      medianAverageCommentsPerConsultations = median(consultationStats.map(_.numberOfComments)),
      medianAverageDaysPerConsultation =median(consultationStats.map(_.daysActive)),
      organizationsPerCategory = organizationStatsPerCategory)
  }

  def storeFinalLawInDB(consultationId: Long, finalLawPath:String, finalLawText:String, userId:java.util.UUID) = {
    val repository = new ConsultationRepository()
    repository.storeFinalLawInDB(consultationId, finalLawPath,finalLawText, userId)
  }

}