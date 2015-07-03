package model.viewmodels

import play.api.libs.json._
import model.dtos._
import utils.ImplicitWrites._

case class ConsultationViewModel(val consultation:model.dtos.Consultation,
                            val allowedAnnotations: Seq[AnnotationType],
                            val discussionThreads : Seq[DiscussionThread],
                            val user: Option[model.User],
                                 val relevantMaterial: Seq[RelevantMaterial])
{
   def annotationTypesToJson():String =
   {
     Json.toJson(allowedAnnotations).toString()
   }
}
