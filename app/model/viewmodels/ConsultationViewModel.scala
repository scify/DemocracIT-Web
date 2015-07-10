package model.viewmodels

import play.api.libs.json._
import model.dtos._
import utils.ImplicitWrites._

case class ConsultationViewModel(consultation:model.dtos.Consultation,
                                 allowedAnnotations: Seq[AnnotationTags],
                                 discussionThreads : Seq[DiscussionThread],
                                 user: Option[model.User],
                                 relevantMaterials: Seq[RelevantMaterial],
                                 relevantLaws: Seq[RelevantLaws])
{
   def annotationTypesToJson():String = Json.toJson(allowedAnnotations).toString()

  def discussionThreadsToJson():String =Json.toJson(discussionThreads).toString()
  def relevantLawsToJson():String =Json.toJson(relevantLaws).toString()

}
