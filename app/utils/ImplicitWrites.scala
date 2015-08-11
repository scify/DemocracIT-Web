package utils

import model.dtos.CommentSource.CommentSource
import model.dtos.CommentSource._
import model.dtos._
import play.api.data.FormError
import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._


object ImplicitWrites {

//  implicit val annotationTypeWrites: Writes[AnnotationTags] = (
//    (JsPath \ "id").write[Int] and
//      (JsPath \ "description").write[String]
//    )(unlift(AnnotationTags.unapply))

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
       "key" -> Json.toJson(o.key),
      "message" -> o.message//Json.toJson(Messages(o.message))
    )
  }

  implicit val ByteRead = new Reads[Byte] {
    override def reads(json: JsValue): JsResult[Byte] = JsSuccess(json.as[Int].toByte)
  }
  implicit object byteWrites extends Writes[Byte]
  {
    def writes(b:Byte) = Json.toJson(b.toInt)
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

