package democracit.services

import java.util.Date

import democracit.dtos._
import democracit.repositories._
import democracit.viewmodels.HomeViewModel
import org.joda.time.DateTime

class ConsultationManager {
  val repository = new ConsultationRepository()

  def search(searchRequest: ConsultationSearchRequest): List[Consultation] = {
    repository.search(searchRequest)
  }

  def get(consultationId: Long): Consultation = {
    repository.get(consultationId)
  }

  def getConsultationsForHomePage(): HomeViewModel = {
    val consultations = repository.latestConsultations(10)
    val today = new Date();
    new HomeViewModel(
      activeConsultations = consultations.filter(p => p.endDate.after(today)),
      recentConsultations = consultations.filter(p => p.endDate.before(today)))
  }

}