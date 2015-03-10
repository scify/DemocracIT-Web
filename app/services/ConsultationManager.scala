package services

import model._
import model.dataaccess._

class ConsultationManager
{
  def search(searchRequest: ConsultationSearchRequest):List[Consultation] = {
      val repository = new ConsultationRepository()
      repository.search(searchRequest);
  }
}