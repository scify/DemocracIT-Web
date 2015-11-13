package model.services

import model.User
import model.repositories.{ConsultationRepository, EvaluationRepository}
import model.viewmodels.EvaluationViewModel

class EvaluationManager {

    def get(user:Option[User]): EvaluationViewModel= {
      val repository = new ConsultationRepository()
      val evaluationRepository = new EvaluationRepository()

      EvaluationViewModel(user = user, evaluationRepository.getConsultationCommentsPerMonth())
    }
}
