package utils

import model.dtos.CommentSource._
import model.dtos.{Comment, Annotation, DiscussionThread, AnnotationType}
import play.api.data.FormError
import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._


object ImplicitWrites {

  implicit val annotationTypeWrites: Writes[AnnotationType] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "description").write[String]
    )(unlift(AnnotationType.unapply))

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
       "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(Messages(o.message))
    )
  }

  implicit val annotationWrites = Json.writes[Annotation]
  implicit val discussionThreadWrites= Json.writes[DiscussionThread]
  implicit object commentSourcesWrites extends Writes[CommentSource]
  {
    def writes(c:CommentSource) = Json.obj(
      "commentSource" -> Json.toJson(c.id)
    )
  }
  implicit val commentsWrites = Json.writes[model.dtos.Comment]

}

