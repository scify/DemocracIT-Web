package model.viewmodels

import model.dtos._
import org.apache.commons.lang3.StringUtils
import play.api.libs.json._
import utils.ImplicitReadWrites._

import scala.collection.mutable.ListBuffer
import scala.collection.mutable.ArrayBuffer

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
        val annTagWithCommentsTemp = AnnotationTagPerArticleWithComments(annTag.annotationTag,annTag.article_name,annTag.id,annTag.numberOfComments)
        annotationProblemsArr += (annTagWithCommentsTemp)
      }
    }
    annotationProblemsArr.toList
  }

  def groupLaws():Seq[(String, Seq[RelevantLaws])]  = {

    val results:Seq[(String, Seq[RelevantLaws])] = this.relevantLaws.groupBy( law => law.entity_law.replace(" ","").replace(".","")).toList
    results
  }

  def findOccurances(lawName:String):Int = {
    var i = 0
    val lawNameStripped = lawName.toLowerCase().replace(" ","").replace(".","")
    for(law <- this.relevantLaws) {
      val lawStripped = law.entity_law.toLowerCase().replace(" ","").replace(".","")
      if(lawStripped == lawNameStripped) {
        i += 1
      }
    }
    i
  }

  def articlesOccurances(lawName:String):Int = {
    var articles = ArrayBuffer[String]()
    for(law <- this.relevantLaws) {

      if(!articles.contains(law.article_title) && lawName == law.entity_law.replace(" ","").replace(".","")) {
        articles += law.article_title
      }
    }
    articles.length
  }

  def articleNameTrimmed(articleName:String):String = {
    val trimmed = StringUtils.substringBefore(articleName, ":");
    trimmed
  }


}

