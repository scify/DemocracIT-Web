package model.services

import java.{lang, util}
import java.util.Date
import model.dtos._
import model.repositories._
import model.viewmodels._
import model.dtos.PlatformStats
import org.scify.democracit.solr.{DitSorlQuery}

//case class SearchViewModel(consultations: List[Consultation],searchRequest:ConsultationSearchRequest)
//{
//  val totalResults = consultations.length
//  val activeConsultations = consultations.filter(_.a)
//  def calculateStats = {
//    //do stuff with the consultations
//  }
//}

class ConsultationManager {

  private val commentsPageSize = 50

  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {

    val q= new DitSorlQuery()

    val ministryIds = new util.HashSet[java.lang.Long]()
    if (searchRequest.ministryId>0)
      ministryIds.add(searchRequest.ministryId.asInstanceOf[Long])

    val res = q.queryConsultations(searchRequest.query,false,ministryIds)
    val i =res.iterator()

    while(i.hasNext()) {
      val each = i.next()
      System.out.println(each + " : " + each.getTitle());
    }

    //todo: define the view model and drop the List[Consultation]. What should we display to the user? We probably need total number found of consultations and comments.
    val repository = new ConsultationRepository()
    repository.search(searchRequest)
  }

  def get(consultationId: Long): ConsultationViewModel= {
    val repository = new ConsultationRepository()
    var annotationRepo = new AnnotationRepository()

    ConsultationViewModel(consultation = repository.get(consultationId),
                          allowedAnnotations = annotationRepo.loadAnnotationTypes(),
                          discussionThreads = Nil,
                          user = None)
  }

  def median(s: List[Int]):Int =
  {
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


  def getOpenGovComments(consultationId:Long,articleId:Long, maxCommentId:Option[Long]): List[Comment] = {

    val commentsRepository = new CommentsRepository()
    commentsRepository.getComments(consultationId,articleId,None,CommentSource.OpenGov,maxCommentId,commentsPageSize )
  }
}