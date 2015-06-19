package model.services

import java.util.Date
import model.dtos._
import model.repositories._
import model.viewmodels._
import model.dtos.PlatformStats
import org.scify.democracit.solr.comments.{DitSorlQuery, IDitQuery}
import org.scify.democracit.solr.model.QueryResult

class ConsultationManager {


  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {

    val q: IDitQuery = new DitSorlQuery
    val res: QueryResult = q.query(searchRequest.query, QueryResult.Type.BOTH)

    //todo: define the view model and drop the List[Consultation]. What should we display to the user? We probably need total number found of consultations and comments.
    val repository = new ConsultationRepository()
    repository.search(searchRequest)
  }

  def get(consultationId: Long): ConsultationViewModel= {
    val repository = new ConsultationRepository()
    var annotationRepo = new AnnotationRepository()

    ConsultationViewModel(repository.get(consultationId),
                                        annotationRepo.loadAnnotationTypes(),
                                        Nil,
                                        None)
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
      averageCommentsPerConsultations = median(consultationStats.map(_.numberOfComments)),
      averageDaysPerConsultation =median(consultationStats.map(_.daysActive)),
      organizationsPerCategory = organizationStatsPerCategory)
  }

}