package democracit.services
import democracit.dtos._
import democracit.repositories._

class ConsultationManager
{
  def search(searchRequest: ConsultationSearchRequest):List[Consultation] = {
      val repository = new ConsultationRepository()
      repository.search(searchRequest)
  }

  def get(consultationId: Long):Consultation = {
     val repository = new ConsultationRepository()
     repository.get(consultationId)
  }


}