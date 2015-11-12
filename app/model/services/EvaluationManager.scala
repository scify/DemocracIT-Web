package model.services

import model.User
import model.repositories.{CommentsRepository, ConsultationRepository}
import model.viewmodels.EvaluationViewModel

class EvaluationManager {

    def get(user:Option[User]): EvaluationViewModel= {
      val repository = new ConsultationRepository()
      val commentsRepository = new CommentsRepository()

      EvaluationViewModel(user = user)
    }
}
