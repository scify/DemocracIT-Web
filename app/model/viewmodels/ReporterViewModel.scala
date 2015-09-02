package model.viewmodels

import model.dtos._
import play.api.libs.json._
import utils.ImplicitReadWrites._

import scala.collection.mutable.ListBuffer

case class ReporterViewModel(consultation:model.dtos.Consultation,
                               user: Option[model.User],
                               relevantMaterials: Seq[RelevantMaterial],
                               commentsPerArticle:  Seq[Article],
                               annotationTagWithComments: Seq[AnnotationTagWithComments],
                               annotationTagPerArticleWithComments: Seq[AnnotationTagPerArticleWithComments],
                               relevantLaws: Seq[RelevantLaws],
                               userCommentStats: Seq[UserCommentStats]
                              )
{

  def commentsPerArticleToJson():String =Json.toJson(commentsPerArticle).toString()
  def userCommentStatsToJson():String =Json.toJson(userCommentStats).toString()
  def annotationsForConsultationToJson(type_of_ann:Int):String =Json.toJson(getAnnotationsForConsultation(type_of_ann)).toString()
  def annotationsPerArticleToJson(type_of_ann:Int):String =Json.toJson(getAnnotationsPerArticle(type_of_ann)).toString()

  def totalComments:Int = {
    var total = 0
    for(article <- commentsPerArticle) {
      total += article.commentsNum
    }
    total
  }

  /*This function extracts the problems or reference tags from the Seq and returns the subset
  * type_of_ann is 1 or 2 (1 for reference tags, 2 for problem tags)*/
  def getAnnotationsForConsultation(type_of_ann:Int):Seq[AnnotationTagWithComments] = {
    val annotationProblemsArr = new ListBuffer[AnnotationTagWithComments]()
    for(annTag <- annotationTagWithComments) {
      if(annTag.annotationTag.type_id == type_of_ann) {
        val annTagWithCommentsTemp = AnnotationTagWithComments(annTag.annotationTag,annTag.numberOfComments)
        annotationProblemsArr += (annTagWithCommentsTemp)
      }
    }
    annotationProblemsArr.toList
  }


  def getAnnotationsPerArticle(type_of_ann:Int):Seq[AnnotationTagPerArticleWithComments] = {
    val annotationProblemsArr = new ListBuffer[AnnotationTagPerArticleWithComments]()
    for(annTag <- annotationTagPerArticleWithComments) {
      if(annTag.annotationTag.type_id == type_of_ann) {
        val annTagWithCommentsTemp = AnnotationTagPerArticleWithComments(annTag.annotationTag,annTag.article_name,annTag.numberOfComments)
        annotationProblemsArr += (annTagWithCommentsTemp)
      }
    }
    annotationProblemsArr.toList
  }

  def groupLaws():Seq[(String, Seq[RelevantLaws])]  = {

    val results:Seq[(String, Seq[RelevantLaws])] = this.relevantLaws.groupBy( law => law.entity_law).toList
    results
  }


}

