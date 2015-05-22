package utils

import model.dtos.AnnotationType
import play.api.data.FormError
import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._


object ImplicitWrites {

  implicit val annotationWrites: Writes[AnnotationType] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "description").write[String]
    )(unlift(AnnotationType.unapply))

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
       "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(Messages(o.message))
    )
  }

}

