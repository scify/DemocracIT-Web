package model.viewmodels

import model.dtos._
import org.apache.commons.lang3.StringUtils
import play.api.libs.json._
import utils.ImplicitReadWrites._

import scala.collection.mutable.ArrayBuffer

case class ConsultationViewModel(consultation:model.dtos.Consultation,
                                 annotationsRelatedToProblems: Seq[AnnotationTags],
                                 annotationsRelatedToTopics: Seq[AnnotationTags],
                                 discussionThreads : Seq[DiscussionThread],
                                 user: Option[User],
                                 relevantMaterials: Seq[RelevantMaterial],
                                 relevantLaws: Seq[RelevantLaws],
                                 finalLaw: Option[ConsultationFinalLaw],
                                 ratingUsers: Seq[ConsFinalLawRatingUsers])
{
  private var _distinctLaws:Seq[RelevantLaws] = Nil

   //def annotationTypesToJson():String = Json.toJson(annotationsRelatedToProblems).toString()
  def discussionThreadsToJson():String =Json.toJson(discussionThreads).toString()
  def relevantLawsToJson():String =Json.toJson(this.distinctLaws(false)).toString()
  def ratingUsersToJson():String = Json.toJson(ratingUsers).toString()

  def distinctLaws(ignoreCharacters:Boolean = true):Seq[RelevantLaws] = {

    if (_distinctLaws ==Nil)
      {
        val grouppingFunction =if (ignoreCharacters)
          (x:RelevantLaws) => x.entity_text.toLowerCase().replace(" ","").replace(".","")
        else
          (x:RelevantLaws) => x.entity_text.toLowerCase()

        _distinctLaws  =this.relevantLaws.groupBy(grouppingFunction).map(tuple => tuple._2.head).toList
      }

    _distinctLaws

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

