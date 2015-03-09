package services

import model.ConsultationSearchRequest
import model.dataaccess.ConsultationRepository

class ConsultationManager
{
  def search(searchRequest: ConsultationSearchRequest) = {
      val repository = new ConsultationRepository()
      repository.search(searchRequest);
  }
}