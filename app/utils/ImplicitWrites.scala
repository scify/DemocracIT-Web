package utils

import model.dtos.CommentSource._
import model.dtos.{RelevantLaws, Comment, DiscussionThread, AnnotationTags}
import play.api.data.FormError
import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._


object ImplicitWrites {

  implicit val annotationTypeWrites: Writes[AnnotationTags] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "description").write[String]
    )(unlift(AnnotationTags.unapply))

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
       "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(Messages(o.message))
    )
  }

  implicit val annotationWrites = Json.writes[AnnotationTags]
  implicit val relevantLawsWrites = Json.writes[RelevantLaws]
  implicit val discussionThreadWrites= Json.writes[DiscussionThread]
  implicit object commentSourcesWrites extends Writes[CommentSource]
  {
    def writes(c:CommentSource) = Json.obj(
      "commentSource" -> Json.toJson(c.id)

    )
  }
  implicit val commentsWrites = Json.writes[model.dtos.Comment]

}

