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

  def getConsultationsForHomePage(user: Option[model.User]): HomeViewModel = {
    val repository = new ConsultationRepository()
    val consultations = repository.latestConsultations(10)

    val organizationStats = repository.getOrganizationStats()
    val groups = organizationStats.groupBy(_.category).map(tuple =>  OrganizationPerCategory(tuple._1,tuple._2,tuple._2(0).orderId)).toList

    val totalConsultations = organizationStats.map(_.totalConsultations).sum
    val platformStats = PlatformStats( totalConsultations, groups.sortBy(_.orderId))

    val today = new Date();
    new HomeViewModel(
      activeConsultations = consultations.filter(p => p.endDate.after(today)),
      recentConsultations = consultations.filter(p => p.endDate.before(today)),
      platformStats,
      user
    )
  }

}