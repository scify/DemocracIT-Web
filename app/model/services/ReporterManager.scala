package model.services

import java.util.{Date, UUID}

import model.User
import model.dtos.{ConsFinalLawRatingUsers, ConsultationFinalLaw, CommentWithArticleName}
import model.repositories._
import model.viewmodels._
import play.api.libs.json.JsValue
import play.api.libs.ws.WS

import scala.concurrent.Await
import play.api.Play.current

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
    val consultation = repository.get(consultationId);
    var finalLaw:Option[ConsultationFinalLaw] = repository.getConsultationFinalLaw(consultationId)
    var ratingUsers: Seq[ConsFinalLawRatingUsers]= Nil;
    if (!consultation.isActive) {
      finalLaw = repository.getConsultationFinalLaw(consultation.id)
      if (finalLaw.isDefined)
        ratingUsers= repository.getFinalLawRatingUsers(consultationId, finalLaw.get.id)
    }

    ReporterViewModel(consultation,
                          user = user,
                          relevantMaterials = repository.getRelevantMaterial(consultationId),
                          commentsPerArticle = commentsRepository.getCommentsPerArticle(consultationId),
                          annotationTagWithComments = commentsRepository.getTagsForConsultation(consultationId),
                          annotationTagPerArticleWithComments = commentsRepository.getTagsPerArticle(consultationId),
                          relevantLaws = repository.getRelevantLaws(consultationId),
                          userCommentStats = commentsRepository.getCommentersForConsultation(consultationId),
                          finalLaw,
                          ratingUsers = ratingUsers)
  }


  def getArticleWordCloud(articleId:Long):JsValue = {
    import scala.concurrent.ExecutionContext.Implicits.global
    import scala.concurrent.duration._

    val result = Await.result(
      WS.url(play.api.Play.current.configuration.getString("application.wordCloudBaseUrl").get)
        .withQueryString("article_id" -> articleId.toString, "max_terms" -> "30").get map {
        response => {
          response.json
        }
      },25 seconds)

    result

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
    var commentsToString = "Comment body, Annotated Text, Commenter Name, Date Added" + sys.props("line.separator")
    for (comment <- comments) {
      commentsToString += '"' + comment.body + '"' + "," + '\"' + comment.userAnnotatedText + '"'  +  "," + comment.fullName + "," + '"' + prettyDateFormat(comment.dateAdded) + '"'  + sys.props("line.separator")
    }
    //println(commentsToString)
    commentsToString
  }

  def getDITCommentsCSV(consultationId: Long): String = {
    val commentsRepository = new CommentsRepository()
    var comments:List[model.dtos.Comment] = Nil
    comments = commentsRepository.getDITCommentsForConsultation(consultationId: Long)
    var commentsToString = "Comment body, Annotated Text, Commenter Name, Date Added" + sys.props("line.separator")
    for (comment <- comments) {
      commentsToString += '"' + comment.body + '"' + "," + '"' + comment.userAnnotatedText.get + '"'  +  "," + comment.fullName + "," + '"' + prettyDateFormat(comment.dateAdded) + '"'
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

  def getAnnotationsForConsultationCSV(consultationId: Long): String = {
    val commentsRepository = new CommentsRepository()
    var annTagWithComments :List[model.dtos.AnnotationTagWithComments] = Nil
    annTagWithComments = commentsRepository.getTagsForConsultation(consultationId: Long)
    var annTagWithCommentsToString = ""
    for (annTagWithComment <- annTagWithComments) {
      if(annTagWithComment.annotationTag.type_id == 1) {
        annTagWithCommentsToString += annTagWithComment.annotationTag.description + "," + annTagWithComment.numberOfComments + sys.props("line.separator")
      }
    }
    //println(commentsToString)
    annTagWithCommentsToString
  }

  def getProblemsForConsultationCSV(consultationId: Long): String = {
    val commentsRepository = new CommentsRepository()
    var annTagWithComments :List[model.dtos.AnnotationTagWithComments] = Nil
    annTagWithComments = commentsRepository.getTagsForConsultation(consultationId: Long)
    var annTagWithCommentsToString = ""
    for (annTagWithComment <- annTagWithComments) {
      if(annTagWithComment.annotationTag.type_id == 2) {
        annTagWithCommentsToString += annTagWithComment.annotationTag.description + "," + annTagWithComment.numberOfComments + sys.props("line.separator")
      }
    }
    //println(commentsToString)
    annTagWithCommentsToString
  }

  def prettyDateFormat(date:Date) = {
    val formatIncomming = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val formatOutgoing = new java.text.SimpleDateFormat("dd MMM yyyy HH:mm aaa")
    val dateFormated = formatOutgoing.format(formatIncomming.parse(date.toString))
    dateFormated
  }
}