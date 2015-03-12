package democracit.services
import democracit.dtos._
import democracit.repositories._

class ConsultationManager
{
  val repository = new ConsultationRepository()
  def search(searchRequest: ConsultationSearchRequest):List[Consultation] = {
    repository.search(searchRequest)
  }

  def get(consultationId: Long):Consultation = {
     repository.get(consultationId)
  }

  def getLatestConsultations():List[Consultation] ={
        repository.latestConsultations(10)
  }

}