package model.services

import model.User
import model.repositories.EvaluationRepository
import model.viewmodels.EvaluationViewModel

class EvaluationManager {

    def get(user:Option[User]): EvaluationViewModel= {
      val evaluationRepository = new EvaluationRepository()
      val dateSet = """
                      select to_char(CURRENT_DATE, 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '1 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '2 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '3 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '4 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '5 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '6 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '7 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '8 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '9 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '10 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '11 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '12 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '13 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '14 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '15 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '16 months', 'YYYY/MM') as date union
                      select to_char(CURRENT_DATE - INTERVAL '17 months', 'YYYY/MM') as date"""


      EvaluationViewModel(user = user, evaluationRepository.getConsultationCommentsPerMonth(dateSet))
    }

  def getEvaluationPerOrganization(): List[model.dtos.ConsFrequencyPerOrganization] = {
    val evaluationRepository = new EvaluationRepository()
    var frequencies:List[model.dtos.ConsFrequencyPerOrganization] = Nil
    val dateSet = """
                    select to_char(CURRENT_DATE, 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '1 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '2 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '3 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '4 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '5 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '6 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '7 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '8 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '9 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '10 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '11 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '12 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '13 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '14 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '15 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '16 months', 'YYYY/MM') as date union
                    select to_char(CURRENT_DATE - INTERVAL '17 months', 'YYYY/MM') as date"""
    frequencies = evaluationRepository.getEvaluationPerOrganization(dateSet)
    frequencies
  }
  def getConsDurationPerOrganization(): List[model.dtos.ConsDurationsPerOrganization] = {
    val evaluationRepository = new EvaluationRepository()
    var durations: List[model.dtos.ConsDurationsPerOrganization] = Nil
    durations = evaluationRepository.getConsDurationPerOrganization()
    durations
  }
  def getConsDuration(): List[model.dtos.ConsDurations] = {
    val evaluationRepository = new EvaluationRepository()
    var durations: List[model.dtos.ConsDurations] = Nil
    durations = evaluationRepository.getConsDuration()
    durations
  }
  def getConsCommPerOrganization(): List[model.dtos.CommPerConsPerOrganization] = {
    val evaluationRepository = new EvaluationRepository()
    var durations: List[model.dtos.CommPerConsPerOrganization] = Nil
    durations = evaluationRepository.getCommPerConsPerOrganization()
    durations
  }
  def getConsultations(cons_ids:String): List[model.dtos.ConsultationForEvaluation] = {
    val evaluationRepository = new EvaluationRepository()
    var consultations: List[model.dtos.ConsultationForEvaluation] = Nil
    consultations = evaluationRepository.getConsultations(cons_ids)
    consultations
  }
}
