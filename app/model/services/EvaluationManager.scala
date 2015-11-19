package model.services

import model.User
import model.repositories.{ConsultationRepository, EvaluationRepository}
import model.viewmodels.EvaluationViewModel

class EvaluationManager {

    def get(user:Option[User]): EvaluationViewModel= {
      val repository = new ConsultationRepository()
      val evaluationRepository = new EvaluationRepository()
      val dateSet = """
                      select extract(year from now()) || to_char((now() - interval '1 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '2 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '3 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '4 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '5 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '6 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '7 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '8 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '9 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '10 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '11 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '12 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '1 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '2 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '3 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '4 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '5 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '6 month'), '/MM') as date"""


      EvaluationViewModel(user = user, evaluationRepository.getConsultationCommentsPerMonth(dateSet))
    }

  def getEvaluationPerOrganization(): List[model.dtos.ConsFrequencyPerOrganization] = {
    val evaluationRepository = new EvaluationRepository()
    var frequencies:List[model.dtos.ConsFrequencyPerOrganization] = Nil
    val dateSet = """
                      select extract(year from now()) || to_char((now() - interval '1 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '2 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '3 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '4 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '5 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '6 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '7 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '8 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '9 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '10 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '11 month'), '/MM') as date union
                      select extract(year from now()) || to_char((now() - interval '12 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '1 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '2 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '3 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '4 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '5 month'), '/MM') as date union
                      select extract(year from (now() - interval '1 year')) || to_char((now() - interval '6 month'), '/MM') as date"""
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

}
