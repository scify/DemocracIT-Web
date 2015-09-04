package utils

import model.dtos.CommentSource._
import model.dtos.{AnnotationTags, DiscussionThread}
import play.api.data.FormError
import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._


object Pluralizer {

  def get(x:Number, singleResource:String, pluralResource:String):String = {
    if (x==1)
      x + " " + singleResource
    else
     x + " " + pluralResource
  }
}

