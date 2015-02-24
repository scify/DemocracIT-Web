package services

import javax.inject.Singleton

import interfaces.SearchManagerAbstract
import model.ConsultationSearchRequest

@Singleton
class SearchManager  extends SearchManagerAbstract()
{
  def search(searchRequest: ConsultationSearchRequest) = {
    throw new NotImplementedError();
  }
}