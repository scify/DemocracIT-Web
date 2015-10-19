package model.services

import java.util.UUID

import model.User
import model.dtos.CommentWithArticleName
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


  def getCommentsForConsultationByUserId(consultationId: Long, user_id:UUID, loggedInUser:Option[User]): List[CommentWithArticleName] = {
    val commentsRepository = new CommentsRepository()
    var comments:List[CommentWithArticleName] = Nil
    val loggedInUserId = if (loggedInUser.isDefined) Some(loggedInUser.get.userID) else None
    comments = commentsRepository.getCommentsForConsultationByUserId(consultationId, user_id,loggedInUserId);
    comments
  }

  def getOpenGovCommentsByArticleId(articleId: Long): List[model.dtos.Comment] = {
    val commentsRepository = new CommentsRepository()
    var comments:List[model.dtos.Comment] = Nil
    comments = commentsRepository.getOPenGovCommentsForArticle(articleId)
    comments
  }

  def getDITCommentsByArticleId(articleId: Long): List[model.dtos.Comment] = {
    val commentsRepository = new CommentsRepository()
    var comments:List[model.dtos.Comment] = Nil
    comments = commentsRepository.getDITCommentsForArticle(articleId)
    comments
  }

  def getCommentsByAnnId(annId: Long, consultationId: Long): List[model.dtos.Comment] = {
    val commentsRepository = new CommentsRepository()
    var comments:List[model.dtos.Comment] = Nil
    comments = commentsRepository.getCommentsByAnnId(annId: Long, consultationId: Long)
    comments
  }

  def getCommentsByAnnIdPerArticle(annId: Long, articleId: Long): List[model.dtos.Comment] = {
    val commentsRepository = new CommentsRepository()
    var comments:List[model.dtos.Comment] = Nil
    comments = commentsRepository.getCommentsByAnnIdPerArticle(annId: Long, articleId: Long)
    comments
  }

  def getOpenGovCommentsCSV(consultationId: Long): String = {
    val commentsRepository = new CommentsRepository()
    var comments:List[model.dtos.Comment] = Nil
    comments = commentsRepository.getOpenGovCommentsForConsultation(consultationId: Long)
    var commentsToString = ""
    for (comment <- comments) {
      commentsToString += comment.body + "," + comment.userAnnotatedText.get +  "," + comment.fullName + "," + comment.dateAdded + sys.props("line.separator")
    }
    //println(commentsToString)
    commentsToString
  }

  def getDITCommentsCSV(consultationId: Long): String = {
    val commentsRepository = new CommentsRepository()
    var comments:List[model.dtos.Comment] = Nil
    comments = commentsRepository.getDITCommentsForConsultation(consultationId: Long)
    var commentsToString = ""
    for (comment <- comments) {
      commentsToString += comment.body + "," + comment.userAnnotatedText.get +  "," + comment.fullName + "," + comment.dateAdded
      for(annotationTag <- comment.annotationTagTopics) {
        commentsToString += "," + annotationTag.description
      }
      for(annotationTagProblem <- comment.annotationTagProblems) {
        commentsToString += "," + annotationTagProblem.description
      }
      commentsToString += sys.props("line.separator")
    }
    //println(commentsToString)
    commentsToString
  }
}