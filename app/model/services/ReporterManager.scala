package model.services

import java.util
import java.util.Date

import model.User
import model.dtos.{PlatformStats, _}
import model.repositories._
import model.viewmodels._
import org.scify.democracit.solr.DitSorlQuery

//case class SearchViewModel(consultations: List[Consultation],searchRequest:ConsultationSearchRequest)
//{
//  val totalResults = consultations.length
//  val activeConsultations = consultations.filter(_.a)
//  def calculateStats = {
//    //do stuff with the consultations
//  }
//}

class ReporterManager {

  def get(consultationId: Long, user:Option[User]): ReporterViewModel= {
    val repository = new ConsultationRepository()

    ReporterViewModel(consultation = repository.get(consultationId),
                          user = user,
                          relevantMaterials = repository.getRelevantMaterial(consultationId))
  }


}