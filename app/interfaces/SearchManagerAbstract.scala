package interfaces

import model.ConsultationSearchRequest

abstract class SearchManagerAbstract()
{
  def search(searchRequest: ConsultationSearchRequest)
}