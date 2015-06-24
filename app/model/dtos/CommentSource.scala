package model.dtos

import play.api.libs.json.JsValue


object CommentSource extends Enumeration{
  type CommentSource = Value
  val OpenGov = Value(2)
  val Democracit =Value(1)

  //   def unapply(i:Any): Option[Int] = {
  //    i match {
  //      case OpenGov=> Some(1)
  //      case Democracit => Some(2)
  //      case _ => None
  //    }
  //  }

}