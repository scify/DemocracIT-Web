package democracit.services

import java.util.Date
import democracit.dtos._
import democracit.repositories._
import democracit.model.viewmodels._
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
    val today = new Date();

    new HomeViewModel(
      activeConsultations = consultations.filter(p => p.endDate.after(today)),
      recentConsultations = consultations.filter(p => p.endDate.before(today)),
      user
    )
  }

}