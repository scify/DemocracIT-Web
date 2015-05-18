package democracit.services

import java.util.Date
import democracit.dtos._
import democracit.repositories._
import democracit.model.viewmodels._

class ConsultationManager {


  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {
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