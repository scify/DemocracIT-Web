package model.viewmodels

import play.api.libs.json._
import model.dtos._
import utils.ImplicitWrites._

case class ConsultationViewModel(consultation:model.dtos.Consultation,
                                 allowedAnnotations: Seq[AnnotationTags],
                                 discussionThreads : Seq[DiscussionThread],
                                 user: Option[model.User],
                                 relevantMaterials: Seq[RelevantMaterial],
                                 relevantLaws: Seq[RelevantLaws],
                                  ministerMessages: Seq[MinisterMessage])
{
   def annotationTypesToJson():String = Json.toJson(allowedAnnotations).toString()

  def discussionThreadsToJson():String =Json.toJson(discussionThreads).toString()
  def relevantLawsToJson():String =Json.toJson(this.distinctLaws(false)).toString()

  def distinctLaws(ignoreCharacters:Boolean = true):Seq[RelevantLaws] = {

    val grouppingFunction =if (ignoreCharacters)
                                        (x:RelevantLaws) => x.entity_text.toLowerCase().replace(" ","").replace(".","")
                            else
                                  (x:RelevantLaws) => x.entity_text.toLowerCase()

    this.relevantLaws.groupBy(grouppingFunction).map(tuple => tuple._2.head).toList

  }

  def ministerMessagesToJson():String = Json.toJson(ministerMessages).toString()

}
