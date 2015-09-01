package model.services

import java.util.UUID

import model.User
import model.dtos.Comment
import model.repositories._
import model.viewmodels._

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
    val commentsRepository = new CommentsRepository()

    ReporterViewModel(consultation = repository.get(consultationId),
                          user = user,
                          relevantMaterials = repository.getRelevantMaterial(consultationId),
                          commentsPerArticle = commentsRepository.getCommentsPerArticle(consultationId),
                          annotationTagWithComments = commentsRepository.getTagsForConsultation(consultationId),
                          annotationTagPerArticleWithComments = commentsRepository.getTagsPerArticle(consultationId),
                          relevantLaws = repository.getRelevantLaws(consultationId),
                          userCommentStats = commentsRepository.getCommentersForConsultation(consultationId))
  }


  def getCommentsForConsultationByUserId(consultationId: Long, user_id:UUID, loggedInUser:Option[User]): List[Comment] = {
    val commentsRepository = new CommentsRepository()
    var comments:List[Comment] = Nil
    val loggedInUserId = if (loggedInUser.isDefined) Some(loggedInUser.get.userID) else None
    comments = commentsRepository.getCommentsForConsultationByUserId(consultationId, user_id,loggedInUserId);
    comments
  }


}