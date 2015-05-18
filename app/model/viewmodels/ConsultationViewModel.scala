package democracit.model.viewmodels

import com.fasterxml.jackson.databind.JsonNode
import model.dtos._


case class ConsultationViewModel(val consultation:democracit.dtos.Consultation,
                            val allowedAnnotations: Seq[AnnotationType],
                            val discussionThreads : Seq[DiscussionThread],
                            val user: Option[model.User])
{
   def annotationTypesToJson():String =
   {
     import play.api.libs.json._
     import play.api.libs.functional.syntax._

     implicit val annotationWrites: Writes[AnnotationType] = (
          (JsPath \ "id").write[Long] and
          (JsPath \ "description").write[String]
       )(unlift(AnnotationType.unapply))

      Json.toJson(allowedAnnotations).toString()

   }
}
